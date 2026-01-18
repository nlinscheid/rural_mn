// Cognitive Work Analysis App - Main JavaScript

// Data storage structure
let cwaData = {
    wda: [],
    conta: [],
    stra: [],
    soca: [],
    wca: []
};

// Initialize app on load
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeNavigation();
    initializeForms();
    updateAllDisplays();
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

// Initialize phase navigation
function initializeNavigation() {
    const phaseButtons = document.querySelectorAll('.phase-btn');
    phaseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const phase = this.dataset.phase;
            switchPhase(phase);
        });
    });
}

// Switch between phases
function switchPhase(phase) {
    // Update buttons
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-phase="${phase}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.phase-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(phase).classList.add('active');

    // Update dropdowns
    updateDropdowns(phase);
}

// Initialize all forms
function initializeForms() {
    const phases = ['wda', 'conta', 'stra', 'soca', 'wca'];
    phases.forEach(phase => {
        const form = document.getElementById(`${phase}-form`);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                addNode(phase, new FormData(this));
                this.reset();
            });
        }
    });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Quick add node function
function quickAddNode(phase) {
    const nameInput = document.getElementById(`${phase}-quick-name`);
    const typeSelect = document.getElementById(`${phase}-quick-level`) ||
                      document.getElementById(`${phase}-quick-type`);

    const name = nameInput.value.trim();
    if (!name) {
        alert('Please enter a name');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);

    if (phase === 'wda') {
        formData.append('level', typeSelect.value);
    } else {
        formData.append('type', typeSelect.value);
    }

    addNode(phase, formData);
    nameInput.value = '';
}

// Add node to specific phase
function addNode(phase, formData) {
    const node = {
        id: generateId(),
        timestamp: new Date().toISOString()
    };

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        if (key === 'contaTasks') {
            // Handle multi-select
            const select = document.getElementById('soca-conta-link');
            const selected = Array.from(select.selectedOptions).map(opt => opt.value);
            node[key] = selected;
        } else {
            node[key] = value;
        }
    }

    cwaData[phase].push(node);
    saveData();
    updateDisplay(phase);
    updateDropdowns();

    // Show success feedback
    showNotification(`Added: ${node.name}`);
}

// Update display for a specific phase
function updateDisplay(phase) {
    const list = document.getElementById(`${phase}-list`);
    const count = document.getElementById(`${phase}-count`);

    if (!list) return;

    list.innerHTML = '';
    const nodes = cwaData[phase];
    count.textContent = nodes.length;

    nodes.forEach((node, index) => {
        const item = document.createElement('div');
        item.className = 'node-item';
        item.innerHTML = `
            <div class="node-header">
                <strong>${node.name}</strong>
                <span class="node-badge">${getBadgeText(phase, node)}</span>
            </div>
            <div class="node-details">
                ${node.description ? `<p>${node.description}</p>` : ''}
                ${getNodeMetadata(phase, node)}
            </div>
            <div class="node-actions">
                <button onclick="editNode('${phase}', ${index})" class="btn-edit">Edit</button>
                <button onclick="deleteNode('${phase}', ${index})" class="btn-delete">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Get badge text for node type
function getBadgeText(phase, node) {
    switch(phase) {
        case 'wda': return node.level || 'unknown';
        case 'conta': return node.type || 'unknown';
        case 'stra': return node.type || 'unknown';
        case 'soca': return node.type || 'unknown';
        case 'wca': return node.level || 'unknown';
        default: return '';
    }
}

// Get metadata display for node
function getNodeMetadata(phase, node) {
    let metadata = '';

    switch(phase) {
        case 'wda':
            if (node.parent) {
                const parentNode = cwaData.wda.find(n => n.id === node.parent);
                metadata += `<small>Parent: ${parentNode ? parentNode.name : 'Unknown'}</small><br>`;
            }
            break;
        case 'conta':
            if (node.wdaNode) {
                const wdaNode = cwaData.wda.find(n => n.id === node.wdaNode);
                metadata += `<small>Related WDA: ${wdaNode ? wdaNode.name : 'Unknown'}</small><br>`;
            }
            if (node.prerequisites) {
                metadata += `<small>Prerequisites: ${node.prerequisites}</small><br>`;
            }
            break;
        case 'stra':
            if (node.contaTask) {
                const task = cwaData.conta.find(n => n.id === node.contaTask);
                metadata += `<small>Task: ${task ? task.name : 'Unknown'}</small><br>`;
            }
            metadata += `<small>Efficiency: ${node.efficiency}/5 | Flexibility: ${node.flexibility}/5</small><br>`;
            break;
        case 'soca':
            if (node.contaTasks && node.contaTasks.length > 0) {
                metadata += `<small>Assigned Tasks: ${node.contaTasks.length}</small><br>`;
            }
            if (node.communication) {
                metadata += `<small>Communication: ${node.communication}</small><br>`;
            }
            break;
        case 'wca':
            if (node.straStrategy) {
                const strategy = cwaData.stra.find(n => n.id === node.straStrategy);
                metadata += `<small>Strategy: ${strategy ? strategy.name : 'Unknown'}</small><br>`;
            }
            if (node.socaActor) {
                const actor = cwaData.soca.find(n => n.id === node.socaActor);
                metadata += `<small>Actor: ${actor ? actor.name : 'Unknown'}</small><br>`;
            }
            if (node.training) {
                metadata += `<small>Training: ${node.training}</small><br>`;
            }
            break;
    }

    return metadata;
}

// Update all displays
function updateAllDisplays() {
    ['wda', 'conta', 'stra', 'soca', 'wca'].forEach(phase => {
        updateDisplay(phase);
    });
}

// Update dropdowns with current data
function updateDropdowns(currentPhase = null) {
    // Update WDA parent dropdown
    const wdaParent = document.getElementById('wda-parent');
    if (wdaParent) {
        wdaParent.innerHTML = '<option value="">None</option>';
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
        contaWdaLink.innerHTML = '<option value="">None</option>';
        cwaData.wda.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            contaWdaLink.appendChild(option);
        });
    }

    // Update StrA ConTA link dropdown
    const straContaLink = document.getElementById('stra-conta-link');
    if (straContaLink) {
        straContaLink.innerHTML = '<option value="">None</option>';
        cwaData.conta.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            straContaLink.appendChild(option);
        });
    }

    // Update SOCA ConTA link dropdown (multi-select)
    const socaContaLink = document.getElementById('soca-conta-link');
    if (socaContaLink) {
        socaContaLink.innerHTML = '';
        cwaData.conta.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            socaContaLink.appendChild(option);
        });
    }

    // Update WCA StrA link dropdown
    const wcaStratLink = document.getElementById('wca-stra-link');
    if (wcaStratLink) {
        wcaStratLink.innerHTML = '<option value="">None</option>';
        cwaData.stra.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            wcaStratLink.appendChild(option);
        });
    }

    // Update WCA SOCA link dropdown
    const wcaSocaLink = document.getElementById('wca-soca-link');
    if (wcaSocaLink) {
        wcaSocaLink.innerHTML = '<option value="">None</option>';
        cwaData.soca.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            wcaSocaLink.appendChild(option);
        });
    }
}

// Edit node
function editNode(phase, index) {
    const node = cwaData[phase][index];
    const newName = prompt('Edit name:', node.name);

    if (newName && newName.trim()) {
        cwaData[phase][index].name = newName.trim();
        saveData();
        updateDisplay(phase);
        showNotification('Updated successfully');
    }
}

// Delete node
function deleteNode(phase, index) {
    const node = cwaData[phase][index];
    if (confirm(`Delete "${node.name}"?`)) {
        cwaData[phase].splice(index, 1);
        saveData();
        updateDisplay(phase);
        showNotification('Deleted successfully');
    }
}

// Export all data as JSON
function exportAllData() {
    const dataStr = JSON.stringify(cwaData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cwa-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully');
}

// Export edge lists as CSV
function exportEdgeLists() {
    const edges = [];

    // WDA hierarchical edges
    cwaData.wda.forEach(node => {
        if (node.parent) {
            edges.push({
                source: node.parent,
                target: node.id,
                source_name: cwaData.wda.find(n => n.id === node.parent)?.name || '',
                target_name: node.name,
                edge_type: 'wda_hierarchy',
                phase: 'WDA'
            });
        }
    });

    // ConTA to WDA edges
    cwaData.conta.forEach(node => {
        if (node.wdaNode) {
            edges.push({
                source: node.id,
                target: node.wdaNode,
                source_name: node.name,
                target_name: cwaData.wda.find(n => n.id === node.wdaNode)?.name || '',
                edge_type: 'task_to_domain',
                phase: 'ConTA-WDA'
            });
        }

        // Task prerequisites
        if (node.prerequisites) {
            const prereqs = node.prerequisites.split(',').map(p => p.trim());
            prereqs.forEach(prereqId => {
                edges.push({
                    source: prereqId,
                    target: node.id,
                    source_name: prereqId,
                    target_name: node.name,
                    edge_type: 'prerequisite',
                    phase: 'ConTA'
                });
            });
        }
    });

    // StrA to ConTA edges
    cwaData.stra.forEach(node => {
        if (node.contaTask) {
            edges.push({
                source: node.id,
                target: node.contaTask,
                source_name: node.name,
                target_name: cwaData.conta.find(n => n.id === node.contaTask)?.name || '',
                edge_type: 'strategy_for_task',
                phase: 'StrA-ConTA'
            });
        }
    });

    // SOCA to ConTA edges
    cwaData.soca.forEach(node => {
        if (node.contaTasks && Array.isArray(node.contaTasks)) {
            node.contaTasks.forEach(taskId => {
                if (taskId) {
                    edges.push({
                        source: node.id,
                        target: taskId,
                        source_name: node.name,
                        target_name: cwaData.conta.find(n => n.id === taskId)?.name || '',
                        edge_type: 'actor_performs_task',
                        phase: 'SOCA-ConTA'
                    });
                }
            });
        }
    });

    // WCA to StrA edges
    cwaData.wca.forEach(node => {
        if (node.straStrategy) {
            edges.push({
                source: node.id,
                target: node.straStrategy,
                source_name: node.name,
                target_name: cwaData.stra.find(n => n.id === node.straStrategy)?.name || '',
                edge_type: 'competency_for_strategy',
                phase: 'WCA-StrA'
            });
        }

        // WCA to SOCA edges
        if (node.socaActor) {
            edges.push({
                source: node.id,
                target: node.socaActor,
                source_name: node.name,
                target_name: cwaData.soca.find(n => n.id === node.socaActor)?.name || '',
                edge_type: 'competency_for_actor',
                phase: 'WCA-SOCA'
            });
        }
    });

    // Convert to CSV
    const csv = [
        ['source', 'target', 'source_name', 'target_name', 'edge_type', 'phase'].join(','),
        ...edges.map(e => [
            e.source,
            e.target,
            `"${e.source_name}"`,
            `"${e.target_name}"`,
            e.edge_type,
            e.phase
        ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cwa-edge-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification(`Exported ${edges.length} edges to CSV`);
}

// Import data
function importData() {
    const fileInput = document.getElementById('file-input');
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const imported = JSON.parse(event.target.result);

                if (confirm('This will replace all current data. Continue?')) {
                    cwaData = imported;
                    saveData();
                    updateAllDisplays();
                    updateDropdowns();
                    showNotification('Data imported successfully');
                }
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    fileInput.click();
}

// Clear all data
function clearAllData() {
    if (confirm('This will delete ALL data permanently. Are you sure?')) {
        if (confirm('Really delete everything? This cannot be undone!')) {
            cwaData = {
                wda: [],
                conta: [],
                stra: [],
                soca: [],
                wca: []
            };
            saveData();
            updateAllDisplays();
            updateDropdowns();
            showNotification('All data cleared');
        }
    }
}

// Update statistics
function updateStats() {
    const totalNodes = Object.values(cwaData).reduce((sum, phase) => sum + phase.length, 0);
    document.getElementById('total-nodes').textContent = totalNodes;

    // Count connections
    let connections = 0;

    // Count WDA hierarchies
    connections += cwaData.wda.filter(n => n.parent).length;

    // Count ConTA-WDA links
    connections += cwaData.conta.filter(n => n.wdaNode).length;

    // Count StrA-ConTA links
    connections += cwaData.stra.filter(n => n.contaTask).length;

    // Count SOCA-ConTA links
    cwaData.soca.forEach(n => {
        if (n.contaTasks && Array.isArray(n.contaTasks)) {
            connections += n.contaTasks.filter(t => t).length;
        }
    });

    // Count WCA-StrA and WCA-SOCA links
    connections += cwaData.wca.filter(n => n.straStrategy).length;
    connections += cwaData.wca.filter(n => n.socaActor).length;

    document.getElementById('total-connections').textContent = connections;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
