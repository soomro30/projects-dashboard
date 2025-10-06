# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application built with Create React App that implements a multi-theme admin dashboard interface. The application features multiple UI themes (Casual, Corporate, Condensed, Simple, Executive) with extensive component libraries for forms, tables, charts, email interfaces, and social features.

## Development Commands

Based on package.json scripts:

- `npm start` - Start development server (opens on localhost:3000)
- `npm run build` - Build production bundle to `build/` directory
- `npm test` - Run tests with Jest in watch mode
- `npm run eject` - Eject from Create React App (one-way operation)

## Architecture and Structure

### Theme-Based Architecture
The application uses a theme-based routing system where each theme provides a complete UI experience:

- **Route Structure**: Each theme is accessible via `/theme-name/*` routes
- **Theme Components**: Located in `src/Theme/` directory
  - `Casual.jsx` - Casual theme implementation
  - `Corporate.jsx` - Corporate theme implementation
  - `Condensed.jsx` - Condensed theme implementation (default)
  - `Simple.jsx` - Simple theme implementation
  - `Executive.jsx` - Executive theme implementation
  - `ThemeColors.js` - Color scheme definitions

### Component Organization
Components are organized by functionality in `src/components/`:

- **Builder/** - Layout building components
- **Calendar/** - Calendar and date picker components
- **Card/** - Card layouts and drag-drop functionality
- **Chart/** - Data visualization components
- **Email/ComposeEmail/** - Email composition and management
- **Forms/** - Form components and validation
- **Layouts/** - Page layout components
- **Maps/** - Map integration components
- **Quickview/** - Quick preview overlay system
- **Search/** - Search functionality
- **Social/** - Social media integration components
- **Tables/** - Data table components
- **Extra/MenuLevel/** - Navigation and menu components
- **Theme-Condensed/** - Condensed theme-specific components (37 files)
  - **Dashboard/** - Main dashboard with development/project cards, CSV data integration
  - **ProjectDashboard/** - Individual project detail pages with PDF export, charts, maps
  - **Header/** - Theme header with notifications, user info, quick view toggler
  - **Sidebar/** - Navigation sidebar with collapsible menus, pin functionality
  - **Search/** - Overlay search with keyboard shortcuts
  - **Color/** - Theme color utilities

### State Management
- **Redux**: Uses Redux with React-Redux for state management
- **Store**: Configured in `src/redux/store.js`
- **QuickView Context**: Special context for quick preview functionality in `src/QuickViewContext.js`

### Key Dependencies
- **React 18** with React Router v6 for routing
- **Bootstrap 5** and React Bootstrap for UI components
- **Redux** for state management
- **ECharts** for data visualization
- **AG Charts Enterprise** - Advanced charting in ProjectDashboard
- **Papa Parse** - CSV data parsing for project data
- **html2canvas & jsPDF** - PDF export functionality
- **React Skycons Extended** - Weather icons
- **React Quill** for rich text editing
- **Moment.js** for date handling
- **React Grid Layout** for draggable layouts
- **React Perfect Scrollbar** - Custom scrollbars in Sidebar
- **React SlideDown** - Animated menu transitions

## Firebase Integration

The project includes Firebase hosting configuration (`firebase.json`) with:
- Build output directory: `build/`
- Single Page Application routing support
- Deploy with: `firebase deploy` (after running `npm run build`)

## Development Notes

- **Default Theme**: Application defaults to Condensed theme on root route
- **Hot Reloading**: Development server supports hot reloading for all React components
- **Asset Management**: Uses Webpack asset processing for images, fonts, and stylesheets
- **CSS Processing**: Supports both CSS and SCSS with autoprefixer
- **Component Testing**: Uses Jest and React Testing Library (basic smoke tests in place)

## File Patterns

- **Theme Files**: `/src/Theme/*.jsx` - Main theme implementations
- **Components**: `/src/components/[Category]/` - Organized by functionality
- **Redux Files**: `/src/redux/` - Store, actions, and reducers
- **Assets**: `/src/assets/` - Static assets, plugins, and legacy JavaScript
- **Pages**: `/src/pages/` - Page-level components and legacy JavaScript

## Common Development Workflows

When adding new features:
1. Determine which theme(s) need the feature
2. Create reusable components in appropriate `/src/components/` category
3. Update theme files to incorporate new components
4. Add Redux actions/reducers if state management is needed
5. Test across all themes for consistency

When modifying themes:
- Each theme file (`src/Theme/*.jsx`) contains complete routing and layout structure
- Themes share common components but may have different styling
- Update `ThemeColors.js` for consistent color schemes across themes

## Theme-Condensed Specific Implementation

### Data Flow
1. **CSV Data Source**: Projects loaded from `/assets/data/projects_data.csv`
2. **Papa Parse Integration**: CSV parsing with header detection and normalization
3. **Dynamic Routing**: `/condensed/project/:projectId` for individual projects

### Dashboard Features
- **Two-Level View**: Developments → Projects hierarchy
- **Development Cards**: Show aggregate stats (total projects, completed, ongoing, budget)
- **Project Cards**: Display progress bars (planned vs actual), dates, budget, manager
- **Metric Cards**: Portfolio-wide statistics (8 cards showing developments, projects, costs, stages)
- **Search Functionality**: Filter projects by name, manager, or stage
- **Image Integration**: Dynamic project images from `dashboard.imkan.ae:8081/webroot/images/`

### ProjectDashboard Features
- **PDF Export**: Full dashboard export using html2canvas + jsPDF
- **AG Charts Integration**: Advanced charts for budget, progress, and financial data
- **Map Integration**: Google Maps with coordinate parsing from CSV
- **Weather Display**: React Skycons for weather visualization
- **Image Gallery**: Project images with modal viewer
- **Data Normalization**: Utility functions for parsing numeric fields, dates, HTML stripping

### Sidebar Navigation
- **Collapsible Menus**: Multi-level navigation with SlideDown animations
- **Pin Functionality**: Persistent sidebar with toggle control
- **Perfect Scrollbar**: Custom scrolling for menu items
- **Responsive Design**: Mobile controls and overlay drawer
- **IMKAN Branding**: Custom logo integration

### Header Components
- **NotificationList**: User notifications display
- **UserInfo**: Profile section with settings, toggler, heading
- **QuickViewToggler**: Toggle for quick view panel
- **MobileControls**: Responsive mobile menu controls
- **Conditional Display**: Hides on login/register/error pages

### Search Component
- **Keyboard Shortcuts**: Type anywhere to activate search
- **ESC to Close**: Quick dismiss functionality
- **Overlay Transition**: CSS transitions with react-transition-group
- **Search Suggestions**: Dynamic results display

### Data Utilities (Shared between Dashboard & ProjectDashboard)
- `parseNumeric()`: Parse CSV numeric values with comma handling
- `stripHtml()`: Remove HTML tags and entities from text
- `normaliseRow()`: Transform raw CSV rows into structured data
- `formatCurrency()`: Display currency with AED symbol
- `formatLargeNumber()`: Abbreviate large numbers (K, M, B, T)
- `extractCoordinateComponent()`: Parse various coordinate formats
- `projectTheme()`: Dynamic color theming based on progress percentage

### Routes in Condensed Theme
```javascript
/ or /condensed → Dashboard (development/project cards)
/condensed/project/:projectId → ProjectDashboard (individual project)
/condensed/dashboard → Dashboard (alias)
/condensed/email → Email view
/condensed/social → Social view
/condensed/builder → Builder view
... (all other routes as documented above)
```