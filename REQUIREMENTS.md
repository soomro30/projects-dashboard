# Construction Projects Reporting System - Requirements

## Project Overview
Development of a comprehensive construction projects reporting dashboard system using the existing React application framework with the Condensed theme as the primary interface.

## Data Source
- **Current**: CSV file located at `/public/assets/data/projects_data.csv` (100 projects)
- **Future**: API integration for real-time data

## Dashboard Components Requirements

### 1. Timeline Section
**Purpose**: Visual project timeline tracking
- **Display**: Project timeline comparison (planned vs actual)
- **UI Components**:
  - Timeline visualization using existing Chart components (`/src/components/Chart/`)
  - Progress tracking bars using UIElements Progress components
- **Data Fields Used**:
  - `projectStartDate`, `ActualEndDate`, `CompletionDate`
  - `stagePlanProgress`, `stageActualProgress`
  - `stageForecastCompletion`

### 2. Financial Section
**Purpose**: Budget and financial tracking overview
- **Total Budget Display**: `estimatedBudget`, `approvedBudget`
- **Total Spent Tracking**: `totalSpent`
- **Variations Tracking**: Calculate difference between estimated and actual
- **Contract Value Display**: `contractorBudget`, `designBudget`, `supervisionBudget`, `developmentBudget`, `contingencyBudget`
- **UI Components**:
  - Card components from `/src/components/Card/`
  - Chart components for financial visualization
  - Progress indicators for budget utilization

### 3. Progress Tracking
**Purpose**: Visual progress comparison and reporting
- **Planned Progress**: `plannedProgress`, `stagePlanProgress`
- **Actual Progress**: `actualProgress`, `stageActualProgress`
- **Progress Comparison Charts**: Side-by-side and overlay comparisons
- **UI Components**:
  - ECharts integration for progress visualization
  - Progress bars and circular progress indicators
  - Color-coded status indicators

### 4. Project Management
**Purpose**: Risk management and visual documentation
- **Risk Log**:
  - Display `criticalRisks` with severity indicators
  - Risk categorization and status tracking
- **Project Photos Gallery**:
  - Image display from `projectProgressImage1`, `projectProgressImage2`, `projectProgressImage3`
  - Additional images: `image1Name` through `image8Name`
  - Gallery component from `/src/components/Extra/Gallery`

### 5. Stakeholders Section
**Purpose**: Project team and responsibility management
- **Project Stakeholders List**:
  - `projectManager`, `devPM`, `designPM`
  - `projectConsultant`, `projectContractor`
  - `Client`, `Employer`, `ProjectSupervision`
- **Contact Information**: Integration with existing data structure
- **Responsibility Matrix**: Role-based access and responsibility display
- **UI Components**:
  - Table components from `/src/components/Tables/`
  - Contact cards using Card components

### 6. Key Dates Section
**Purpose**: Critical dates and milestone tracking
- **Project Start Date**: `projectStartDate`, `launchDate`
- **Target Completion Date**: `CompletionDate`
- **Anticipated Completion Date**: `stageForecastCompletion`
- **Milestone Dates**: `stageStartDate`, `stageEndDate`
- **Critical Path Dates**: Derived from project timeline
- **Extension of Time (EOT) Details**: Calculate delays and extensions
- **UI Components**:
  - Calendar components from `/src/components/Calendar/`
  - Timeline visualization
  - Date picker components for interactive filtering

### 7. Feasibility Information
**Purpose**: Project viability and compliance tracking
- **Project Feasibility Status**: Derived from `dev_status`, `cons_status`
- **Technical Feasibility Assessment**: Based on project stage and progress
- **Financial Feasibility Indicators**: `SPI` (Schedule Performance Index), `IRR` (Internal Rate of Return)
- **Risk Assessment Summary**: Aggregated from `criticalRisks`
- **Resource Availability Status**: Team availability and allocation
- **Environmental Impact Considerations**: Project-specific environmental data
- **Regulatory Compliance Status**: Approval status tracking
- **UI Components**:
  - Status indicators and badges
  - Compliance checklist components
  - Risk assessment matrices

## Layout Requirements

### Full Page Condensed Dashboard Design
- **Theme**: Use Condensed theme (`/src/Theme/Condensed.jsx`) as primary layout
- **Route**: Accessible via `/condensed/projects` or `/projects`
- **Layout Structure**:
  - Header: Project selector and key metrics summary
  - Sidebar: Project navigation and filters
  - Main Content: Grid-based dashboard sections

### Single Page Visibility
- **Grid Layout**: 6-column responsive grid using Bootstrap 5
- **Section Organization**:
  - Row 1: Timeline (full width)
  - Row 2: Financial (50%) + Progress Tracking (50%)
  - Row 3: Key Dates (33%) + Stakeholders (33%) + Feasibility (33%)
  - Row 4: Project Management (Risk Log + Photos Gallery)
- **Responsive Design**: Mobile-friendly collapsible sections

### Professional Appearance
- **Color Scheme**: Use existing theme colors from `/src/Theme/ThemeColors.js`
- **Typography**: Consistent with condensed theme typography
- **Icons**: FontAwesome and MDI icon integration
- **Cards**: Clean card-based layout for each section
- **Spacing**: Consistent padding and margins following existing patterns

### Visual Charts and Graphs
- **Chart Library**: ECharts integration (already available in dependencies)
- **Chart Types**:
  - Timeline charts for project scheduling
  - Progress bar charts for completion tracking
  - Financial pie/donut charts for budget breakdown
  - Gantt charts for project phases
  - Risk assessment heat maps
- **Interactivity**:
  - Drill-down capabilities
  - Filter and zoom functionality
  - Export capabilities for reports

## Technical Implementation Requirements

### Component Architecture
- **Main Component**: `/src/components/Projects/Dashboard/`
- **Sub-components**:
  - `TimelineSection.jsx`
  - `FinancialSection.jsx`
  - `ProgressSection.jsx`
  - `StakeholdersSection.jsx`
  - `KeyDatesSection.jsx`
  - `FeasibilitySection.jsx`
  - `ProjectManagementSection.jsx`

### Data Management
- **CSV Processing**: Use existing CSV parsing utilities
- **State Management**: Redux integration for project data
- **API Preparation**: Structure for future API integration
- **Caching**: Local storage for performance optimization

### UI Component Utilization
- **Existing Components**: Leverage available UI components from `/src/components/`
- **Theme Integration**: Full integration with Condensed theme styling
- **Responsive Framework**: Bootstrap 5 grid system
- **Performance**: Optimized rendering for large datasets

### Integration Points
- **Router Integration**: Add routes to Condensed theme routing
- **Header Integration**: Project selector in condensed header
- **Sidebar Integration**: Project navigation menu
- **Search Integration**: Project search functionality

## Data Schema Mapping

### Key Data Fields from CSV:
```
Core Project Info:
- projectId, projectName, projectDescription, projectStage
- projectCategory, projectLocation, projectCompany

Financial Data:
- estimatedBudget, approvedBudget, totalSpent
- designBudget, contractorBudget, supervisionBudget
- developmentBudget, contingencyBudget

Progress Tracking:
- plannedProgress, actualProgress
- stagePlanProgress, stageActualProgress

Timeline Data:
- projectStartDate, ActualEndDate, CompletionDate
- stageStartDate, stageEndDate, stageForecastCompletion

Stakeholder Data:
- projectManager, devPM, designPM
- projectConsultant, projectContractor
- Client, Employer, ProjectSupervision

Risk & Status:
- criticalRisks, dev_status, cons_status
- SPI, IRR

Media:
- projectProgressImage1-3, image1Name-image8Name
```

## Future Enhancements
- Real-time data synchronization via API
- Advanced analytics and reporting
- Mobile application support
- Export functionality (PDF reports)
- Role-based access control
- Notification system for critical milestones
- Integration with project management tools

## Success Criteria
- Single page dashboard with all required sections visible
- Professional, clean design matching existing theme standards
- Fast loading and responsive performance
- Interactive charts and visualizations
- Easy navigation and user-friendly interface
- Successful integration with existing application architecture