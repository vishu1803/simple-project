# Pipeline Builder

A visual drag-and-drop pipeline builder built with React Flow, featuring a clean light theme and FastAPI backend for DAG validation.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![React Flow](https://img.shields.io/badge/React%20Flow-12-green)

## Features

- **9 Node Types** - Input, Output, LLM, Text, Filter, Transform, Conditional, API, Merge
- **Dynamic Variable Detection** - Text nodes parse `{{variable}}` patterns
- **Visual Pipeline Building** - Drag-and-drop interface with connections
- **DAG Validation** - Backend validates pipeline structure
- **Undo/Redo** - Full history support (Ctrl+Z / Ctrl+Y)
- **Light Theme** - Clean, professional aesthetic

## Quick Start

### Frontend

```bash
cd frontend-vite
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Open http://localhost:5173 in your browser.

## Node Types

| Node | Description |
|------|-------------|
| **Input** | Entry point for data |
| **Output** | Data output destination |
| **LLM** | AI model with system instructions |
| **Text** | Template with `{{variable}}` support |
| **Filter** | Conditional filtering |
| **Transform** | Data transformation |
| **Conditional** | If/else branching |
| **API** | HTTP requests |
| **Merge** | Combine multiple inputs |

## Text Node Variables

Type `{{variableName}}` to create dynamic input handles:

```
Hello {{name}}, welcome to {{company}}!
```

This creates two input handles: `name` and `company`.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Delete` | Remove selected |

## Project Structure

```
frontend-vite/
├── src/
│   ├── App.jsx           # Main app layout
│   ├── ui.jsx            # React Flow canvas
│   ├── toolbar.jsx       # Node library
│   ├── submit.jsx        # Pipeline submission
│   ├── store.js          # Zustand state
│   ├── CustomEdge.jsx    # Edge with delete
│   ├── nodes/
│   │   ├── BaseNode.jsx  # Base component
│   │   ├── inputNode.jsx
│   │   ├── outputNode.jsx
│   │   ├── llmNode.jsx
│   │   ├── textNode.jsx
│   │   └── ...
│   ├── index.css         # Global styles
│   └── nodes/nodes.css   # Node styles
backend/
├── main.py               # FastAPI server
└── requirements.txt
```

## API

### POST /pipelines/parse

Validates pipeline structure.

**Request:**
```json
{
  "nodes": [{"id": "node-1", "type": "input"}],
  "edges": [{"source": "node-1", "target": "node-2"}]
}
```

**Response:**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

## Tech Stack

- **Frontend**: React 18, Vite, React Flow, Zustand
- **Backend**: FastAPI, Python 3.8+
- **Styling**: CSS with custom properties

## License

MIT
