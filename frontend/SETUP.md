# React Frontend Setup Guide

## Prerequisites

- Node.js 16+ (should already be installed)
- npm or yarn
- Running Laravel API at `http://localhost:8000`

---

## Installation Steps

### 1. Install Dependencies

Navigate to the frontend directory:
```bash
cd kanban-frontend/kanban-ui
```

Install packages:
```bash
npm install
```

This installs:
- React 19.2.7
- Vite 8.1.0
- Axios 1.18.1
- date-fns 4.4.0

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## Verify Installation

1. Open browser to: **http://localhost:5173**
2. You should see the Kanban Board interface
3. Make sure the Laravel API is running at `http://localhost:8000`

### Test the Integration

1. Click **+ New Board** button
2. Fill in:
   - Name: "My First Board"
   - Description: "Test board"
   - Color: Select any color
3. Click **Create Board**
4. The board should appear in the tabs
5. Click on the board tab to open it
6. Try creating lists and cards

---

## Project Structure

```
kanban-ui/
├── src/
│   ├── components/
│   │   ├── BoardView.jsx     # Main board display
│   │   ├── ListView.jsx       # List columns
│   │   ├── CardView.jsx       # Individual cards
│   │   └── BoardForm.jsx      # Create board form
│   ├── App.jsx                # Main app component
│   ├── App.css                # Kanban styling
│   └── main.jsx               # Entry point
├── public/
├── vite.config.js             # Vite config with proxy
├── package.json
└── README.md
```

---

## Features Implemented

### Board Management
- Create new boards with name, description, color
- View list of all boards
- Select board to view

### List Management
- Create lists (columns) within a board
- View all lists in a board
- Card count per list

### Card Management
- Create cards with title
- View all cards in a list
- Delete cards
- Due date display with color coding:
  - Red: Overdue
  - Yellow: Due soon (3 days)
  - Gray: Normal

### Tags & Members
- Display tags on cards (with colors)
- Display assigned members (avatars)
- API integration ready for adding/removing

---

## API Integration

The app connects to the Laravel API via Axios:

**Base URL**: `http://localhost:8000/api/v1`

### Endpoints Used

```javascript
// Boards
GET    /boards                    - List all boards
POST   /boards                    - Create board
GET    /boards/{id}               - Get board details

// Lists
GET    /boards/{id}/lists         - Get board lists
POST   /boards/{id}/lists         - Create list

// Cards
GET    /boards/{id}/lists/{lid}/cards      - Get cards
POST   /boards/{id}/lists/{lid}/cards      - Create card
DELETE /boards/{id}/lists/{lid}/cards/{cid} - Delete card
```

---

## Configuration

### Vite Proxy

The `vite.config.js` includes a proxy to avoid CORS issues:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

This means you can also use `/api/v1/boards` instead of the full URL.

---

## Troubleshooting

### Cannot connect to API
- Make sure Laravel API is running at `http://localhost:8000`
- Check browser console for CORS errors
- Verify Laravel's `config/cors.php` allows `http://localhost:5173`

### Port 5173 already in use
Start on a different port:
```bash
npm run dev -- --port 3000
```

### Dependencies installation failed
Clear npm cache and retry:
```bash
npm cache clean --force
npm install
```

### Blank screen
- Check browser console for errors
- Make sure all dependencies installed correctly
- Try: `rm -rf node_modules package-lock.json && npm install`

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Next Steps

### Add More Features

1. **Drag & Drop Cards**
   - Install `@hello-pangea/dnd` (React Beautiful DnD)
   - Implement card dragging between lists

2. **Edit Cards**
   - Add modal to edit card details
   - Update description, due date, tags, members

3. **Tag Management**
   - Create tag management UI
   - Add/remove tags from cards

4. **Member Management**
   - Add member CRUD interface
   - Assign/unassign members to cards

5. **Due Date Picker**
   - Add date picker component
   - Set/update card due dates

6. **Real-time Updates**
   - Add WebSocket support
   - Live collaboration features
