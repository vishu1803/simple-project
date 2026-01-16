// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

// Maximum number of history states to keep
const MAX_HISTORY = 50;

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  // History for undo/redo
  history: [],
  historyIndex: -1,

  // Save current state to history
  saveToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };

    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    // Limit history size
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  // Undo action
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      set({
        nodes: JSON.parse(JSON.stringify(prevState.nodes)),
        edges: JSON.parse(JSON.stringify(prevState.edges)),
        historyIndex: newIndex
      });
    }
  },

  // Redo action
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      set({
        nodes: JSON.parse(JSON.stringify(nextState.nodes)),
        edges: JSON.parse(JSON.stringify(nextState.edges)),
        historyIndex: newIndex
      });
    }
  },

  // Check if undo/redo is available
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    get().saveToHistory();
    set({
      nodes: [...get().nodes, node]
    });
  },

  deleteNode: (nodeId) => {
    get().saveToHistory();
    // Also delete any edges connected to this node
    set({
      nodes: get().nodes.filter(node => node.id !== nodeId),
      edges: get().edges.filter(edge =>
        edge.source !== nodeId && edge.target !== nodeId
      )
    });
  },

  onNodesChange: (changes) => {
    // Save to history for position changes (drag end)
    const hasDragEnd = changes.some(change =>
      change.type === 'position' && change.dragging === false
    );
    if (hasDragEnd) {
      get().saveToHistory();
    }

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    get().saveToHistory();
    set({
      edges: addEdge({
        ...connection,
        type: 'custom',
        animated: true,
        style: {
          stroke: '#94a3b8',
        }
      }, get().edges),
    });
  },

  deleteEdge: (edgeId) => {
    get().saveToHistory();
    set({
      edges: get().edges.filter(edge => edge.id !== edgeId)
    });
  },

  clearAll: () => {
    get().saveToHistory();
    set({
      nodes: [],
      edges: [],
      nodeIDs: {}
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },
}));
