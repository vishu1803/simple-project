# Pipeline Builder - Backend

FastAPI backend for pipeline DAG validation.

## Quick Start

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Server runs at http://localhost:8000

## API Endpoints

### GET /
Health check endpoint.

### POST /pipelines/parse
Validates if the pipeline is a valid Directed Acyclic Graph (DAG).

**Request Body:**
```json
{
  "nodes": [
    {"id": "input-1", "type": "customInput"},
    {"id": "llm-1", "type": "llm"},
    {"id": "output-1", "type": "customOutput"}
  ],
  "edges": [
    {"source": "input-1", "target": "llm-1"},
    {"source": "llm-1", "target": "output-1"}
  ]
}
```

**Response:**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

## DAG Validation

Uses Kahn's algorithm for topological sorting:
1. Build adjacency list and calculate in-degrees
2. Start with nodes having no incoming edges
3. Process nodes, reducing neighbor in-degrees
4. If all nodes visited → Valid DAG
5. If cycle detected → Invalid (not a DAG)

## Dependencies

- FastAPI
- Uvicorn
- Pydantic
