# Pipeline Builder

A visual drag-and-drop pipeline builder for creating data processing workflows.

## Overview

Build pipelines by connecting nodes visually. The backend validates the pipeline structure using DAG (Directed Acyclic Graph) validation.

## Getting Started

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

Open http://localhost:5173

## Documentation

- [Frontend Documentation](frontend-vite/README.md)
- [Backend Documentation](backend/README.md)
- [Change Log](CHANGES.md)

## Features

- 9 Node Types (Input, Output, LLM, Text, Filter, Transform, Conditional, API, Merge)
- Text node with `{{variable}}` pattern detection
- Visual connection builder
- DAG validation
- Undo/Redo support
- Light theme UI

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Flow |
| State | Zustand |
| Backend | FastAPI, Python |
