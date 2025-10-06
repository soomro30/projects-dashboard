# Project Dashboard Component

A comprehensive construction project dashboard built with React, designed for IMKAN construction project management.

## Features

### Dashboard Sections
- **Project Header**: Project name, status, and overall completion percentage
- **Timeline Section**: Planned vs actual progress visualization with charts
- **Financial Overview**: Budget, spent, variations, and contract value tracking
- **Progress Tracking**: Visual comparison of planned vs actual progress with charts
- **Stakeholders**: Project manager, contractor, and consultant information
- **Key Dates**: Start, target, and anticipated completion dates
- **Project Management**: Risk indicators and photo gallery placeholders
- **Feasibility Information**: Status tracking and GFA details

### Key Features
- **PDF Export**: A4 and A3 landscape format export capability
- **Print Support**: Browser-based printing with optimized layouts
- **Responsive Design**: Mobile and desktop compatible
- **Interactive Charts**: Using ECharts library for data visualization
- **Real-time Updates**: Refresh functionality for each section
- **Professional Styling**: Using Inter font with construction industry color scheme

## Usage

### Basic Implementation
```jsx
import ProjectDashboard from './components/Theme-Condensed/ProjectDashboard';

function App() {
  return (
    <div className="App">
      <ProjectDashboard />
    </div>
  );
}
```

### With Custom Data
```jsx
import ProjectDashboard from './components/Theme-Condensed/ProjectDashboard';

const projectData = {
  name: "Your Project Name",
  status: "In Progress",
  completion: 75.5,
  plannedCompletion: 80.0,
  startDate: "Jan 15",
  targetDate: "Dec 20",
  budget: "15,000,000 AED",
  spent: "11,250,000 AED",
  manager: "Project Manager Name",
  contractor: "Contractor Company"
};

function App() {
  return (
    <div className="App">
      <ProjectDashboard projectData={projectData} />
    </div>
  );
}
```

### PDF Export Usage
```jsx
import { exportProjectDashboard, printDashboard } from './PDFExport';

// Export A4 landscape PDF
const exportA4 = async () => {
  const result = await exportProjectDashboard('a4', 'landscape');
  if (result.success) {
    console.log('PDF exported successfully');
  }
};

// Export A3 landscape PDF
const exportA3 = async () => {
  const result = await exportProjectDashboard('a3', 'landscape');
  if (result.success) {
    console.log('PDF exported successfully');
  }
};

// Print dashboard
const print = () => {
  printDashboard();
};
```

## Dependencies

### Required Packages
```json
{
  "html2canvas": "^1.4.1",
  "jspdf": "^2.5.1",
  "echarts": "^5.4.0",
  "echarts-for-react": "^3.0.2",
  "react": "^18.0.0"
}
```

### Installation
```bash
npm install html2canvas jspdf echarts echarts-for-react
```

## File Structure
```
ProjectDashboard/
├── Component.jsx       # Main dashboard wrapper
├── Content.jsx         # Dashboard content and layout
├── PDFExport.js        # PDF export functionality
├── style.css          # Dashboard-specific styles
├── index.js           # Export file
└── README.md          # This documentation
```

## Customization

### Styling
- Modify `style.css` for custom colors and layouts
- Use Inter font family throughout for consistency
- Font weight 700 for important data (numbers, dates, titles)

### Data Integration
- Replace sample data with real API calls
- Implement data binding through props
- Add loading states for async operations

### Chart Customization
- Modify chart options in widget components
- Update colors to match brand guidelines
- Add new chart types as needed

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Notes
- Designed for construction project management
- Optimized for stakeholder presentations
- PDF export works best with stable internet connection
- Print functionality requires modern browser support
- All financial figures are in AED currency format