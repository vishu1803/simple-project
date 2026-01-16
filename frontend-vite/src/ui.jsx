// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, MiniMap, Panel } from "@xyflow/react";
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
import { CustomEdge } from './CustomEdge';

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

// Register custom edge types
const edgeTypes = {
  custom: CustomEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  deleteNode: state.deleteNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  clearAll: state.clearAll,
  undo: state.undo,
  redo: state.redo,
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

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__content">
          <div className="modal__icon">⚠️</div>
          <h2 className="modal__title">{title}</h2>
          <p className="modal__message">{message}</p>
          <div className="confirm-modal__buttons">
            <button className="confirm-modal__btn confirm-modal__btn--cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="confirm-modal__btn confirm-modal__btn--confirm" onClick={onConfirm}>
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    deleteNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    clearAll,
    undo,
    redo,
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

  // Handle keyboard shortcuts - only when not in an input field
  const onKeyDown = useCallback((event) => {
    // Don't handle keyboard shortcuts when typing in input fields
    const target = event.target;
    const isInputField = target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable;

    if (isInputField) {
      return; // Let the input field handle the key event
    }

    // Undo: Ctrl+Z / Cmd+Z
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    }

    // Redo: Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      redo();
    }
  }, [undo, redo]);

  const handleClearClick = () => {
    if (nodes.length > 0 || edges.length > 0) {
      setShowClearConfirm(true);
    }
  };

  const handleConfirmClear = () => {
    clearAll();
    setShowClearConfirm(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirm(false);
  };

  const memoNodes = useMemo(() => nodes, [nodes]);
  const memoEdges = useMemo(() => edges, [edges]);

  return (
    <>
      <div ref={reactFlowWrapper} className="canvas-wrapper" onKeyDown={onKeyDown} tabIndex={0}>
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
          edgeTypes={edgeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          snapToGrid
          connectionLineType="smoothstep"
          connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 1.5 }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={null}
          defaultEdgeOptions={{
            type: 'custom',
            animated: true,
          }}
        >
          <Background
            variant="dots"
            gap={gridSize}
            size={1}
            color="rgba(0, 0, 0, 0.08)"
          />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={nodeColor}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />

          {/* Top Right Panel with Clear All only */}
          {(nodes.length > 0 || edges.length > 0) && (
            <Panel position="top-right" className="canvas-panel">
              <button
                className="clear-button"
                onClick={handleClearClick}
                title="Clear all nodes and connections"
              >
                🗑️ Clear All
              </button>
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
        title="Clear All?"
        message="This will remove all nodes and connections from the canvas. This action can be undone with Ctrl+Z."
      />
    </>
  );
};
