// CWA Interactive Visualization App
// Data storage
let cwaData = {
    wda: [],
    conta: [],
    stra: [],
    soca: [],
    wca: []
};

// Network instances
let networks = {};
let currentPhase = 'wda';
let physicsEnabled = {
    wda: true,
    conta: true,
    stra: true,
    soca: true,
    wca: true,
    integrated: true
};

// Color schemes
const colors = {
    wda: {
        purpose: '#9333ea',
        values: '#4f46e5',
        functions: '#0284c7',
        processes: '#0d9488',
        physical: '#059669'
    },
    conta: {
        goal: '#ea580c',
        constraint: '#dc2626',
        decision: '#7c3aed',
        activity: '#2563eb'
    },
    stra: {
        procedure: '#059669',
        heuristic: '#0891b2',
        algorithm: '#7c3aed',
        improvisation: '#d97706'
    },
    soca: {
        individual: '#2563eb',
        team: '#7c3aed',
        department: '#0891b2',
        automation: '#475569'
    },
    wca: {
        skill: '#059669',
        rule: '#d97706',
        knowledge: '#dc2626'
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeNetworks();
    updateDropdowns();
    updateStats();
});

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('cwaData');
    if (saved) {
        cwaData = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('cwaData', JSON.stringify(cwaData));
    updateStats();
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Add node to phase
function addNode(phase) {
    const nameInput = document.getElementById(`${phase}-name`);
    const name = nameInput.value.trim();

    if (!name) {
        alert('Please enter a name');
        return;
    }

    const node = {
        id: generateId(),
        name: name,
        timestamp: new Date().toISOString()
    };

    // Phase-specific properties
    if (phase === 'wda') {
        const levelSelect = document.getElementById('wda-level');
        const parentSelect = document.getElementById('wda-parent');
        node.level = levelSelect.value;
        if (parentSelect.value) node.parent = parentSelect.value;
    } else if (phase === 'conta') {
        const typeSelect = document.getElementById('conta-type');
        const wdaLink = document.getElementById('conta-wda-link');
        node.type = typeSelect.value;
        if (wdaLink.value) node.wdaNode = wdaLink.value;
    } else if (phase === 'stra') {
        const typeSelect = document.getElementById('stra-type');
        const taskLink = document.getElementById('stra-task-link');
        node.type = typeSelect.value;
        if (taskLink.value) node.contaTask = taskLink.value;
    } else if (phase === 'soca') {
        const typeSelect = document.getElementById('soca-type');
        node.type = typeSelect.value;
    } else if (phase === 'wca') {
        const levelSelect = document.getElementById('wca-level');
        const actorLink = document.getElementById('wca-actor-link');
        node.level = levelSelect.value;
        if (actorLink.value) node.socaActor = actorLink.value;
    }

    cwaData[phase].push(node);
    nameInput.value = '';

    saveData();
    updateNetwork(phase);
    updateDropdowns();

    // Also update integrated view
    if (networks.integrated) {
        updateNetwork('integrated');
    }

    // Close panel after adding
    const panel = document.getElementById('panel-content');
    const icon = document.getElementById('toggle-icon');
    if (panel.classList.contains('open')) {
        setTimeout(() => {
            panel.classList.remove('open');
            icon.textContent = '➕';
        }, 300);
    }
}

// Delete node (can be called from network click - future feature)
function deleteNode(phase, id) {
    const index = cwaData[phase].findIndex(n => n.id === id);
    if (index > -1) {
        if (confirm(`Delete "${cwaData[phase][index].name}"?`)) {
            cwaData[phase].splice(index, 1);
            saveData();
            updateNetwork(phase);
            updateDropdowns();
            if (networks.integrated) {
                updateNetwork('integrated');
            }
        }
    }
}

// Update dropdowns
function updateDropdowns() {
    // Update WDA parent dropdown
    const wdaParent = document.getElementById('wda-parent');
    if (wdaParent) {
        wdaParent.innerHTML = '<option value="">Parent node (optional)...</option>';
        cwaData.wda.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = `${node.name} (${node.level})`;
            wdaParent.appendChild(option);
        });
    }

    // Update ConTA WDA link dropdown
    const contaWdaLink = document.getElementById('conta-wda-link');
    if (contaWdaLink) {
        contaWdaLink.innerHTML = '<option value="">Link to WDA...</option>';
        cwaData.wda.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            contaWdaLink.appendChild(option);
        });
    }

    // Update StrA task link dropdown
    const straTaskLink = document.getElementById('stra-task-link');
    if (straTaskLink) {
        straTaskLink.innerHTML = '<option value="">Link to Task...</option>';
        cwaData.conta.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            straTaskLink.appendChild(option);
        });
    }

    // Update WCA actor link dropdown
    const wcaActorLink = document.getElementById('wca-actor-link');
    if (wcaActorLink) {
        wcaActorLink.innerHTML = '<option value="">Link to Actor...</option>';
        cwaData.soca.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            wcaActorLink.appendChild(option);
        });
    }
}

// Initialize all networks
function initializeNetworks() {
    initializeNetwork('wda');
    initializeNetwork('conta');
    initializeNetwork('stra');
    initializeNetwork('soca');
    initializeNetwork('wca');
    initializeNetwork('integrated');
}

// Initialize a single network
function initializeNetwork(phase) {
    const container = document.getElementById(`${phase}-network`);
    if (!container) return;

    const options = {
        nodes: {
            shape: 'box',
            margin: 10,
            font: { size: 14, face: 'Inter, sans-serif' },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            arrows: { to: { enabled: true, scaleFactor: 0.5 } },
            smooth: { type: 'continuous' },
            color: { color: '#cbd5e1', highlight: '#64748b' },
            width: 2
        },
        physics: {
            enabled: physicsEnabled[phase],
            stabilization: { iterations: 200 },
            barnesHut: {
                gravitationalConstant: -8000,
                springConstant: 0.04,
                springLength: 150
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            zoomView: true,
            dragView: true
        },
        layout: phase === 'wda' ? {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                sortMethod: 'directed',
                nodeSpacing: 150,
                levelSeparation: 120
            }
        } : {}
    };

    const data = { nodes: [], edges: [] };
    networks[phase] = new vis.Network(container, data, options);

    // Add click handler
    networks[phase].on('click', function(params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            showNodeDetails(phase, nodeId);
        }
    });

    updateNetwork(phase);
}

// Update network visualization
function updateNetwork(phase) {
    if (!networks[phase]) return;

    let nodes = [];
    let edges = [];

    if (phase === 'integrated') {
        // Build integrated view
        ({ nodes, edges } = buildIntegratedNetwork());
    } else {
        // Build phase-specific network
        ({ nodes, edges } = buildPhaseNetwork(phase));
    }

    networks[phase].setData({ nodes: nodes, edges: edges });
}

// Build phase-specific network
function buildPhaseNetwork(phase) {
    const nodes = [];
    const edges = [];

    cwaData[phase].forEach(item => {
        const typeOrLevel = item.level || item.type || '';
        const color = colors[phase][typeOrLevel] || '#64748b';

        nodes.push({
            id: item.id,
            label: item.name,
            color: { background: color, border: color, highlight: { background: color, border: '#000' } },
            font: { color: '#ffffff' }
        });

        // Add edges based on relationships
        if (phase === 'wda' && item.parent) {
            // WDA hierarchical edges
            edges.push({
                from: item.parent,
                to: item.id,
                arrows: { to: { enabled: true, scaleFactor: 0.8 } },
                color: { color: '#94a3b8', highlight: '#64748b' },
                width: 2
            });
        }

        if (phase === 'conta' && item.wdaNode) {
            // Link to WDA node
            const wdaNode = cwaData.wda.find(n => n.id === item.wdaNode);
            if (wdaNode) {
                nodes.push({
                    id: wdaNode.id,
                    label: wdaNode.name,
                    color: { background: colors.wda[wdaNode.level], border: colors.wda[wdaNode.level] },
                    font: { color: '#ffffff' },
                    shape: 'ellipse'
                });
                edges.push({ from: item.id, to: wdaNode.id, dashes: true });
            }
        }

        if (phase === 'stra' && item.contaTask) {
            // Link to task
            const task = cwaData.conta.find(n => n.id === item.contaTask);
            if (task) {
                nodes.push({
                    id: task.id,
                    label: task.name,
                    color: { background: colors.conta[task.type], border: colors.conta[task.type] },
                    font: { color: '#ffffff' },
                    shape: 'ellipse'
                });
                edges.push({ from: item.id, to: task.id });
            }
        }

        if (phase === 'wca' && item.socaActor) {
            // Link to actor
            const actor = cwaData.soca.find(n => n.id === item.socaActor);
            if (actor) {
                nodes.push({
                    id: actor.id,
                    label: actor.name,
                    color: { background: colors.soca[actor.type], border: colors.soca[actor.type] },
                    font: { color: '#ffffff' },
                    shape: 'ellipse'
                });
                edges.push({ from: item.id, to: actor.id });
            }
        }
    });

    return { nodes, edges };
}

// Build integrated network
function buildIntegratedNetwork() {
    const nodes = [];
    const edges = [];
    const addedNodes = new Set();

    // Add all nodes from all phases
    Object.keys(cwaData).forEach((phase, phaseIndex) => {
        cwaData[phase].forEach(item => {
            if (!addedNodes.has(item.id)) {
                const typeOrLevel = item.level || item.type || '';
                const phaseColors = {
                    wda: '#9333ea',
                    conta: '#2563eb',
                    stra: '#059669',
                    soca: '#d97706',
                    wca: '#dc2626'
                };

                nodes.push({
                    id: item.id,
                    label: item.name,
                    color: {
                        background: colors[phase]?.[typeOrLevel] || phaseColors[phase],
                        border: colors[phase]?.[typeOrLevel] || phaseColors[phase]
                    },
                    font: { color: '#ffffff' },
                    group: phase
                });
                addedNodes.add(item.id);
            }
        });
    });

    // Add edges
    // WDA hierarchical edges
    cwaData.wda.forEach(node => {
        if (node.parent) {
            edges.push({
                from: node.parent,
                to: node.id,
                color: { color: '#9333ea' },
                width: 2,
                title: 'WDA Hierarchy'
            });
        }
    });

    // ConTA to WDA links
    cwaData.conta.forEach(task => {
        if (task.wdaNode) {
            edges.push({
                from: task.id,
                to: task.wdaNode,
                color: { color: '#2563eb' },
                dashes: true,
                title: 'Task → Domain'
            });
        }
    });

    // StrA to ConTA links
    cwaData.stra.forEach(strategy => {
        if (strategy.contaTask) {
            edges.push({
                from: strategy.id,
                to: strategy.contaTask,
                color: { color: '#059669' },
                dashes: true,
                title: 'Strategy → Task'
            });
        }
    });

    // WCA to SOCA links
    cwaData.wca.forEach(competency => {
        if (competency.socaActor) {
            edges.push({
                from: competency.id,
                to: competency.socaActor,
                color: { color: '#dc2626' },
                dashes: true,
                title: 'Competency → Actor'
            });
        }
    });

    return { nodes, edges };
}

// Show node details (for future expansion)
function showNodeDetails(phase, nodeId) {
    // For now, just log
    console.log('Clicked node:', phase, nodeId);
}

// Switch phase
function switchPhase(phase) {
    currentPhase = phase;

    // Update tabs
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-phase="${phase}"]`).classList.add('active');

    // Update phase views
    document.querySelectorAll('.phase-view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${phase}-view`).classList.add('active');

    // Update entry forms in floating panel
    document.querySelectorAll('.entry-form').forEach(form => {
        form.style.display = 'none';
    });
    const entryForm = document.getElementById(`${phase}-entry`);
    if (entryForm) {
        entryForm.style.display = 'block';
    }

    // Update network if needed
    if (networks[phase]) {
        setTimeout(() => networks[phase].fit(), 100);
    }
}

// Toggle floating panel
function togglePanel() {
    const panel = document.getElementById('panel-content');
    const icon = document.getElementById('toggle-icon');

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        icon.textContent = '➕';
    } else {
        panel.classList.add('open');
        icon.textContent = '✕';
    }
}

// Fit view (use current phase)
function fitView() {
    if (networks[currentPhase]) {
        networks[currentPhase].fit({ animation: true });
    }
}

// Toggle physics (use current phase)
function togglePhysics() {
    physicsEnabled[currentPhase] = !physicsEnabled[currentPhase];
    if (networks[currentPhase]) {
        networks[currentPhase].setOptions({ physics: { enabled: physicsEnabled[currentPhase] } });
        const btn = document.getElementById('physics-btn');
        if (btn) {
            btn.style.opacity = physicsEnabled[currentPhase] ? '1' : '0.5';
        }
    }
}

// Filter integrated view
function filterIntegrated(filter) {
    if (!networks.integrated) return;

    const { nodes, edges } = buildIntegratedNetwork();

    if (filter === 'all') {
        networks.integrated.setData({ nodes, edges });
    } else if (filter.includes('-')) {
        // Show connections between two phases
        const [phase1, phase2] = filter.split('-');
        const filteredNodes = nodes.filter(n => n.group === phase1 || n.group === phase2);
        const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
        const filteredEdges = edges.filter(e => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to));
        networks.integrated.setData({ nodes: filteredNodes, edges: filteredEdges });
    } else {
        // Show single phase
        const filteredNodes = nodes.filter(n => n.group === filter);
        networks.integrated.setData({ nodes: filteredNodes, edges: [] });
    }

    setTimeout(() => networks.integrated.fit(), 100);
}

// Update stats
function updateStats() {
    ['wda', 'conta', 'stra', 'soca', 'wca'].forEach(phase => {
        const el = document.getElementById(`stat-${phase}`);
        if (el) el.textContent = cwaData[phase].length;
    });

    const total = Object.values(cwaData).reduce((sum, arr) => sum + arr.length, 0);
    const totalEl = document.getElementById('stat-total');
    if (totalEl) totalEl.textContent = total;
}

// Clear phase data
function clearPhaseData(phase) {
    if (confirm(`Clear all ${phase.toUpperCase()} data?`)) {
        cwaData[phase] = [];
        saveData();
        updateNetwork(phase);
        updateDropdowns();
        if (networks.integrated) {
            updateNetwork('integrated');
        }
    }
}

// Clear all data
function clearAll() {
    if (confirm('Delete ALL data? This cannot be undone!')) {
        if (confirm('Are you absolutely sure?')) {
            cwaData = { wda: [], conta: [], stra: [], soca: [], wca: [] };
            saveData();
            Object.keys(networks).forEach(phase => updateNetwork(phase));
            updateDropdowns();
        }
    }
}

// Export JSON
function exportJSON() {
    const dataStr = JSON.stringify(cwaData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cwa-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Export CSV edge list
function exportCSV() {
    const edges = [];

    // WDA hierarchies
    cwaData.wda.forEach(node => {
        if (node.parent) {
            const parent = cwaData.wda.find(n => n.id === node.parent);
            edges.push([node.id, node.parent, node.name, parent?.name || '', 'wda_hierarchy', 'WDA']);
        }
    });

    // ConTA-WDA links
    cwaData.conta.forEach(task => {
        if (task.wdaNode) {
            const wdaNode = cwaData.wda.find(n => n.id === task.wdaNode);
            edges.push([task.id, task.wdaNode, task.name, wdaNode?.name || '', 'task_to_domain', 'ConTA-WDA']);
        }
    });

    // StrA-ConTA links
    cwaData.stra.forEach(strategy => {
        if (strategy.contaTask) {
            const task = cwaData.conta.find(n => n.id === strategy.contaTask);
            edges.push([strategy.id, strategy.contaTask, strategy.name, task?.name || '', 'strategy_for_task', 'StrA-ConTA']);
        }
    });

    // WCA-SOCA links
    cwaData.wca.forEach(competency => {
        if (competency.socaActor) {
            const actor = cwaData.soca.find(n => n.id === competency.socaActor);
            edges.push([competency.id, competency.socaActor, competency.name, actor?.name || '', 'competency_for_actor', 'WCA-SOCA']);
        }
    });

    const csv = [
        ['source', 'target', 'source_name', 'target_name', 'edge_type', 'phase'].join(','),
        ...edges.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cwa-edgelist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Import JSON
function importJSON() {
    const input = document.getElementById('file-input');
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (confirm('Import data? This will replace current data.')) {
                    cwaData = imported;
                    saveData();
                    Object.keys(networks).forEach(phase => updateNetwork(phase));
                    updateDropdowns();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Toggle WDA links in ConTA view
let showingWdaLinks = false;
function toggleWdaLinks() {
    showingWdaLinks = !showingWdaLinks;
    const btn = document.getElementById('wda-links-btn');
    if (btn) {
        btn.style.opacity = showingWdaLinks ? '1' : '0.5';
    }
    updateNetwork('conta');
}
