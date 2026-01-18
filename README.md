# Cognitive Work Analysis App

A comprehensive web-based tool for conducting Cognitive Work Analysis (CWA) on complex sociotechnical systems. This application supports all five phases of CWA and provides data management, quick entry, and network analysis export capabilities.

## Features

- **Five CWA Phases**: Complete support for all phases of cognitive work analysis
  - Work Domain Analysis (WDA)
  - Control Task Analysis (ConTA)
  - Strategies Analysis (StrA)
  - Social Organization & Cooperation Analysis (SOCA)
  - Worker Competencies Analysis (WCA)

- **Quick Add Functionality**: Rapidly add nodes with essential information
- **Detailed Data Entry**: Comprehensive forms for detailed analysis
- **Inter-Phase Linking**: Connect data across different CWA phases
- **Edge List Export**: Export relationships as CSV edge lists for network analysis
- **Data Persistence**: Automatic saving to browser localStorage
- **Import/Export**: Full data backup and restoration via JSON

## Usage

### Getting Started

1. Open `index.html` in a modern web browser
2. Navigate between phases using the top navigation buttons
3. Use "Quick Add" for rapid data entry or detailed forms for comprehensive analysis

### Work Domain Analysis (WDA)

Define the work domain across five abstraction levels:
- **Functional Purpose**: Overall objectives and goals
- **Values & Priority Measures**: Criteria for success
- **Purpose-Related Functions**: What the system does
- **Object-Related Processes**: How components work
- **Physical Objects**: Physical elements of the system

Create hierarchical relationships by setting parent nodes.

### Control Task Analysis (ConTA)

Document what needs to be accomplished:
- Define goals, constraints, decisions, and activities
- Link tasks to work domain nodes
- Establish task prerequisites

### Strategies Analysis (StrA)

Capture how tasks can be performed:
- Document procedures, heuristics, algorithms, and improvisation
- Link strategies to specific tasks
- Rate efficiency and flexibility

### Social Organization (SOCA)

Map actors and teams:
- Define individuals, teams, departments, and automation
- Assign tasks to actors
- Document communication channels

### Worker Competencies (WCA)

Identify required skills and knowledge:
- Classify competencies as skill-based, rule-based, or knowledge-based
- Link to strategies and actors
- Document training requirements

## Exporting Data

### Edge Lists (CSV)

Click "Export Edge Lists" to generate a CSV file containing all relationships:
- WDA hierarchies
- Task-to-domain mappings
- Strategy-to-task connections
- Actor-to-task assignments
- Competency requirements

The edge list format is compatible with network analysis tools like Gephi, Cytoscape, and R's igraph.

**CSV Format:**
```
source,target,source_name,target_name,edge_type,phase
```

### Complete Data (JSON)

Click "Export All Data" to save all your CWA data in JSON format for backup or sharing.

## Data Management

- **Import Data**: Load previously exported JSON files
- **Clear All Data**: Reset the application (with confirmation)
- **Auto-Save**: Data automatically saves to browser localStorage

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with localStorage support

## GitHub Pages Deployment

This app is designed to run directly from GitHub Pages:

1. Push these files to your repository
2. Enable GitHub Pages in repository settings
3. Select the branch containing these files
4. Access your app at: `https://[username].github.io/[repository]/`

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no dependencies)
- **Storage**: Browser localStorage
- **Export Formats**: JSON, CSV

## Tips

- Use Quick Add for rapid brainstorming sessions
- Use detailed forms for comprehensive documentation
- Regularly export your data for backup
- Link nodes across phases to build a complete analysis
- Export edge lists to visualize relationships in network analysis tools

## About Cognitive Work Analysis

Cognitive Work Analysis is a framework developed by Jens Rasmussen and colleagues for understanding complex sociotechnical systems. It provides a structured approach to analyzing work domains, tasks, strategies, social structures, and competencies.

## License

This tool is provided as-is for research and educational purposes.

## Contributing

Issues and pull requests welcome at the repository.
