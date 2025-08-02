# Lego Dashboard Frontend

Angular 20 frontend application for the Lego Dashboard that displays news actions with political analysis and coverage metrics.

## Features

- **Split-Screen View**: Toggle between single panel and split panel view for side-by-side comparisons
- **Date Filtering**: Select from available dates to view actions from specific time periods
- **Publisher Filtering**: Filter by political leaning (Republican/Democrat) or specific publishers
- **Political Spectrum Visualization**: Visual slider showing the political leaning of displayed actions
- **Action Coverage Display**: Horizontal bars showing coverage metrics for each action
- **Real-time Data**: Connects to backend API for live data updates

## Prerequisites

- Node.js (v20+ recommended)
- npm or yarn
- Backend API running on http://localhost:8080

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open http://localhost:4200 in your browser

## API Integration

The frontend connects to these backend endpoints:

- `GET /api/topactions` - Fetch actions with optional filters (date, publisher, group)
- `GET /api/publishers` - Get list of available publishers
- `GET /api/dates` - Get available dates with action counts

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── dashboard-panel.component.*
│   │   ├── date-selector.component.*
│   │   ├── filter-dropdown.component.*
│   │   ├── political-slider.component.*
│   │   └── action-list.component.*
│   ├── models/              # TypeScript interfaces
│   │   └── action.model.ts
│   ├── services/            # API and business logic
│   │   └── api.service.ts
│   ├── app.component.*      # Main app component
├── environments/            # Environment configurations
├── assets/                  # Static assets
└── styles.scss             # Global styles
```

## Components

### DashboardPanelComponent
Reusable panel component that can be used for single or split-screen views. Contains date selector, filters, political slider, and action list.

### DateSelectorComponent
Dropdown for selecting available dates with action counts.

### FilterDropdownComponent
Generic dropdown component for publisher and category filtering.

### PoliticalSliderComponent
Visual representation of political spectrum with a movable indicator showing the average Republican score of displayed actions.

### ActionListComponent
Displays a list of actions with coverage bars, political indicators, and agreement breakdowns.

## Styling

The application uses a dark theme with:
- Primary background: #1e2329
- Secondary background: #252b33
- Accent color: #ff6b35 (orange)
- Political colors: Blue (#4285f4) for Democrat, Red (#ea4335) for Republican

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Development

### Adding New Components

```bash
ng generate component components/new-component
```

### Adding New Services

```bash
ng generate service services/new-service
```

## Error Handling

The application includes comprehensive error handling:
- Network timeout and retry logic
- User-friendly error messages
- Retry functionality for failed requests
- Loading states and empty state handling