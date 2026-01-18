# Cognitive Work Analysis - Interactive Visualization Tool

A fully interactive web-based tool for conducting Cognitive Work Analysis (CWA) with real-time network visualizations. Build, explore, and export your CWA models visually.

## 🎯 Features

### Interactive Network Visualizations
- **Real-time graph updates** - See your CWA model build as you add nodes
- **Zoomable, pannable networks** - Navigate large models with ease
- **Physics-based layouts** - Automatic node positioning with customizable physics
- **Click-to-interact** - Click nodes to view details (expandable)
- **Color-coded by type** - Instantly identify node types and relationships

### All 5 CWA Phases with Live Graphs

1. **Work Domain Analysis (WDA)**
   - 5-level abstraction hierarchy
   - Hierarchical tree visualization
   - Functional Purpose → Values → Functions → Processes → Physical Objects

2. **Control Task Analysis (ConTA)**
   - Task network with goals, constraints, decisions, activities
   - Link tasks to work domain nodes
   - Flow-based visualization
   - Toggle WDA links on/off

3. **Strategies Analysis (StrA)**
   - Document procedures, heuristics, algorithms, improvisation
   - Link strategies to tasks
   - Strategy-task network view

4. **Social Organization (SOCA)**
   - Map individuals, teams, departments, automation
   - Actor-task assignment network
   - Organizational structure visualization

5. **Worker Competencies (WCA)**
   - Skill-based, rule-based, knowledge-based competencies
   - Link to actors and strategies
   - Competency network view

6. **Integrated System View**
   - Complete CWA model in one visualization
   - Filter by phase or relationship type
   - See all connections across the entire system

### Data Management
- **Quick add** - Rapid node entry with minimal fields
- **Auto-save** - All data saved to browser localStorage
- **Export to JSON** - Full data backup
- **Export to CSV Edge List** - Network analysis ready (Gephi, Cytoscape, R, Python)
- **Import data** - Load previous analyses

### Interactive Controls
- **Fit View** - Auto-zoom to fit all nodes
- **Toggle Physics** - Enable/disable automatic layout
- **Filter Views** - Show specific phases or relationships
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Run Locally
1. Download all files
2. Open `index.html` in any modern browser
3. Start building your CWA model!

### Deploy to GitHub Pages
1. Push files to your GitHub repository
2. Go to Settings → Pages
3. Select branch: `claude/cognitive-work-analysis-app-Nqocv`
4. Your app will be live at: `https://[username].github.io/[repo]/`

## 📊 How to Use

### Building Your CWA Model

1. **Start with Work Domain (WDA)**
   - Define your functional purpose at the top
   - Add values, functions, processes, and physical objects
   - Watch the hierarchy build in real-time

2. **Add Tasks (ConTA)**
   - Define what needs to be accomplished
   - Link tasks to work domain nodes
   - See task networks form

3. **Document Strategies (StrA)**
   - Capture different ways to perform tasks
   - Link to specific tasks
   - Visualize strategy options

4. **Map Actors (SOCA)**
   - Add team members, automation, departments
   - Will be able to assign tasks in future updates

5. **Define Competencies (WCA)**
   - Specify required skills and knowledge
   - Link to actors
   - Map training requirements

6. **View Integrated System**
   - See your complete CWA model
   - Use filters to focus on specific relationships
   - Export for further analysis

### Visualization Controls

- **🔍 Fit View** - Zoom to fit all nodes
- **⚡ Physics** - Toggle automatic positioning
- **🔗 Show Links** - Display cross-phase connections
- **Filter Dropdown** - Show specific phases or relationships

### Exporting Your Analysis

**JSON Export** - Complete data structure
```json
{
  "wda": [...],
  "conta": [...],
  "stra": [...],
  "soca": [...],
  "wca": [...]
}
```

**CSV Edge List** - Network analysis format
```csv
source,target,source_name,target_name,edge_type,phase
id1,id2,"Task A","Domain Node B","task_to_domain","ConTA-WDA"
```

Compatible with:
- Gephi (network visualization)
- Cytoscape (biological networks, general network analysis)
- R (igraph, tidygraph)
- Python (NetworkX, graph-tool)
- Neo4j (graph database)

## 🎨 Interactive Features

- **Drag nodes** to rearrange
- **Scroll to zoom** in/out
- **Click+drag background** to pan
- **Click nodes** to interact (details coming soon)
- **Real-time updates** - graphs update instantly
- **Smooth animations** - physics-based movement
- **Responsive legends** - color-coded node types

## 💾 Data Persistence

All data automatically saves to browser localStorage:
- Survives browser refresh
- Persists across sessions
- Cleared only when you choose to clear or by clearing browser data

**Backup your work!** Use Export JSON regularly.

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with:
  - JavaScript ES6+
  - localStorage
  - Canvas support

## 📱 Mobile Support

Fully responsive design works on:
- Desktop (best experience)
- Tablets (full functionality)
- Phones (optimized layout)

Touch controls:
- Pinch to zoom
- Two-finger pan
- Tap to select

## 🔧 Technical Details

- **Frontend**: Pure HTML, CSS, JavaScript
- **Visualization**: vis.js network library
- **Storage**: Browser localStorage API
- **No server required** - runs entirely in browser
- **No dependencies** - vis.js loaded from CDN
- **File size**: ~100KB total

## 📚 About Cognitive Work Analysis

CWA is a framework developed by Jens Rasmussen for analyzing complex sociotechnical systems. It provides five complementary perspectives:

1. **Work Domain Analysis** - What exists in the environment
2. **Control Task Analysis** - What needs to be done
3. **Strategies Analysis** - How it can be done
4. **Social Organization** - Who does it
5. **Worker Competencies** - What skills are needed

This tool helps you build and visualize these analyses interactively.

## 🎯 Use Cases

- Healthcare system analysis
- Industrial process design
- Software system design
- Transportation systems
- Emergency response planning
- Military operations
- Air traffic control
- Nuclear power plant operations
- Any complex sociotechnical system

## 📖 Learn More

- [Work Domain Analysis Handbook](https://www.routledge.com/Work-Domain-Analysis-Concepts-Guidelines-and-Cases/Vicente/p/book/9780805823974)
- [Cognitive Work Analysis Book](https://www.routledge.com/Cognitive-Work-Analysis-Toward-Safe-Productive-and-Healthy-Computer-Based/Vicente/p/book/9780805823974)

## 🤝 Contributing

Issues, suggestions, and improvements welcome!

## 📄 License

Open source for research and educational use.

---

**Start analyzing your complex systems visually!** 🚀
