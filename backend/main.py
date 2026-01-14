from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from collections import defaultdict

app = FastAPI(title="Pipeline API", description="API for analyzing pipeline graphs")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    """Represents a node in the pipeline graph"""
    id: str
    type: Optional[str] = None
    position: Optional[Dict[str, float]] = None
    data: Optional[Dict[str, Any]] = None


class Edge(BaseModel):
    """Represents an edge connecting two nodes"""
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelineRequest(BaseModel):
    """Request body for pipeline analysis"""
    nodes: List[Node]
    edges: List[Edge]


class PipelineResponse(BaseModel):
    """Response body with pipeline analysis results"""
    num_nodes: int
    num_edges: int
    is_dag: bool


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Determines if the graph is a Directed Acyclic Graph (DAG).
    Uses Kahn's algorithm for topological sorting.
    
    A graph is a DAG if:
    1. It's directed (edges have source and target)
    2. It has no cycles
    
    Returns True if the graph is a DAG, False otherwise.
    """
    if not nodes:
        return True  # Empty graph is considered a DAG
    
    # Build adjacency list and in-degree count
    node_ids = {node.id for node in nodes}
    adjacency_list = defaultdict(list)
    in_degree = {node_id: 0 for node_id in node_ids}
    
    for edge in edges:
        # Only consider edges where both source and target exist
        if edge.source in node_ids and edge.target in node_ids:
            adjacency_list[edge.source].append(edge.target)
            in_degree[edge.target] += 1
    
    # Kahn's algorithm: Start with nodes that have no incoming edges
    queue = [node_id for node_id in node_ids if in_degree[node_id] == 0]
    visited_count = 0
    
    while queue:
        current = queue.pop(0)
        visited_count += 1
        
        # For each neighbor, reduce in-degree
        for neighbor in adjacency_list[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we visited all nodes, there's no cycle -> it's a DAG
    return visited_count == len(node_ids)


@app.get('/')
def read_root():
    """Health check endpoint"""
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(pipeline: PipelineRequest):
    """
    Analyze a pipeline graph.
    
    Accepts nodes and edges of a pipeline graph and returns:
    - num_nodes: Total number of nodes
    - num_edges: Total number of edges
    - is_dag: Whether the graph is a Directed Acyclic Graph
    
    Example request body:
    ```json
    {
        "nodes": [
            {"id": "node-1", "type": "input"},
            {"id": "node-2", "type": "output"}
        ],
        "edges": [
            {"source": "node-1", "target": "node-2"}
        ]
    }
    ```
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag_status = is_dag(pipeline.nodes, pipeline.edges)
    
    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=dag_status
    )
