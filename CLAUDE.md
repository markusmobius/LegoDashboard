We have an LLM pipeline that takes daily news stories and splits them into “actions” by major policy makers such as the President, companies or international organizations. Moreover, for each “primary action” we have associated sub-actions which can be quotes, commentary or other reactions. We rate this associated content in terms providing supporting or opposing arguments for the action. Our vision is to create a dashboard that (a) organizes actions by days, (b) coverage of actions by left or right-leaning media, (c) side by side comparisons. Moreover, we provide an API for downloading actions and meta data. 

For tech stack, we want to implement this system with an Angular 20 web frontend and a C# backend (initially use a Python backend API to host/mock data instead)

Based on the image and your requirements, here's a comprehensive set of instructions for Claude Code to create an Angular 20 frontend that replicates this interface for the Lego Dashboard:

## Instructions for Claude Code: Angular 20 Lego Dashboard Frontend

### Project Overview
Create an Angular 20 frontend application that displays news actions (instead of events) from the Lego Dashboard backend. The interface should closely replicate the design shown in the reference image, with the ability to view actions filtered by political leaning and compare them side-by-side.

### Core Features Required

1. **Split-Screen View**
   - Implement a toggleable split-screen mode that allows viewing two panels side-by-side
   - Each panel should be independently controllable with its own filters
   - Include a button/toggle to switch between single panel and split panel view
   - In split mode, typically show "All Publishers" on left and filtered view (Republican/Democrat) on right

2. **Date Selector**
   - Add a date picker at the top of each panel (showing "Mar 18, 2020" format in the image)
   - Connect to backend endpoint `/api/dates` to get available dates
   - When date changes, fetch new data from `/api/topactions?date=YYYY-MM-DD`

3. **Publisher/Category Filters**
   - Top navigation tabs: "RATIO" (active), "MSN", "BING", "ALL"
   - Below that, filter buttons for viewing modes
   - Dropdown for "All Events" (change to "All Actions") that connects to:
     - All Publishers (default)
     - Republican Publishers (`/api/topactions?group=Republican`)
     - Democrat Publishers (`/api/topactions?group=Democrat`)
     - Individual publishers from `/api/publishers`

4. **Political Leaning Slider**
   - Horizontal slider showing political spectrum
   - Left side (blue) = Democrat, Right side (red) = Republican
   - Center line with "Far Left — Center-Right — Far Right" labels
   - Position of the dot should reflect the average Republican score of visible actions

5. **Action List Display**
   - Each action shows:
     - Title/Description (from `Description` field)
     - Coverage bar visualization (blue horizontal bar showing coverage percentage)
     - Coverage number on the right (e.g., "200", "175", etc.)
   - Sort actions by coverage (descending) as returned by API
   - Color-code or add small indicator for Republican vs Democrat leaning actions

6. **Additional UI Elements from Image**
   - "All Publisher Languages" dropdown (can be static for now)
   - "All Categories" dropdown (can be static for now)
   - Search bar for filtering actions
   - "Event Insights" button (change to "Action Insights")
   - Navigation tabs: "Events" (change to "Actions"), "Publishers", "+"

### Backend Integration

Connect to these endpoints:
```
GET http://localhost:8080/api/topactions
    Query params: date, publisher, group
GET http://localhost:8080/api/publishers
GET http://localhost:8080/api/dates
```

### Data Mapping
- Action title → `Description` field
- Coverage visualization → `coverage` field (multiply by 1000 for display number)
- Political leaning → `Republican` field (-1 to 1, where negative is Democrat)
- Agreement data → `agreement` array [supporting, non-supporting, neutral]

### Styling Guidelines
- Use a dark theme similar to the image (dark blue/gray background)
- Orange/coral accent color for active tabs and buttons
- Blue bars for coverage visualization
- Maintain the same spacing and proportions as shown
- Ensure responsive design for different screen sizes

### Technical Requirements
1. Use Angular 20 with TypeScript
2. Implement proper error handling for API calls
3. Add loading states while fetching data
4. Use RxJS for managing state and API calls
5. Implement proper typing for all data models
6. Add CORS handling (backend already sends appropriate headers)

### Component Structure Suggestion
- `AppComponent` - Main container
- `DashboardPanelComponent` - Reusable panel (used once or twice for split view)
- `ActionListComponent` - Displays list of actions
- `PoliticalSliderComponent` - The political spectrum slider
- `DateSelectorComponent` - Date picker
- `FilterDropdownComponent` - Reusable dropdown for filters

### Additional Features to Implement
1. Click on an action to see detailed agreement breakdown
2. Export functionality for the current view
3. Refresh button to reload data
4. Remember user's filter preferences in local storage
5. Smooth animations when switching between views

This should give Claude Code enough context to build a faithful recreation of the interface while adapting it for the Lego Dashboard's action-based data model.