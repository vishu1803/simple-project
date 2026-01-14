// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, MiniMap } from "@xyflow/react";
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode } from './nodes/FilterNode';
import { TransformNode } from './nodes/TransformNode';
import { ConditionalNode } from './nodes/ConditionalNode';
import { APINode } from './nodes/APINode';
import { MergeNode } from './nodes/MergeNode';

import "@xyflow/react/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Register all node types
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  transform: TransformNode,
  conditional: ConditionalNode,
  api: APINode,
  merge: MergeNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

// Custom minimap node colors
const nodeColor = (node) => {
  const colors = {
    customInput: '#10b981',
    customOutput: '#f59e0b',
    llm: '#8b5cf6',
    text: '#3b82f6',
    filter: '#06b6d4',
    transform: '#ec4899',
    conditional: '#f59e0b',
    api: '#ef4444',
    merge: '#6366f1',
  };
  return colors[node.type] || '#6b7280';
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(useShallow(selector));

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(
          event.dataTransfer.getData('application/reactflow')
        );
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const memoNodes = useMemo(() => nodes, [nodes]);
  const memoEdges = useMemo(() => edges, [edges]);

  return (
    <div ref={reactFlowWrapper} className="canvas-wrapper">
      <ReactFlow
        nodes={memoNodes}
        edges={memoEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
      >
        <Background
          variant="dots"
          gap={gridSize}
          size={1}
          color="rgba(255, 255, 255, 0.05)"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};
