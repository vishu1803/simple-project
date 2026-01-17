# Pipeline Builder - Change Log

This document explains all the changes made to the Pipeline Builder application.

---

## 1. BaseNode Component Pattern

### What Changed
Created a reusable `BaseNode` component that all 9 node types extend.

### Why
- **DRY Principle**: Eliminates duplicate code across nodes
- **Consistency**: All nodes share the same visual design
- **Maintainability**: Changes in one place affect all nodes

### How It Works
```jsx
<BaseNode
  id={id}
  title="LLM"
  nodeType="llm"
  icon="🤖"
  inputs={[{ id: 'prompt', label: 'Prompt' }]}
  outputs={[{ id: 'response', label: 'Response' }]}
>
  {/* Custom node content */}
</BaseNode>
```

### Files
- `src/nodes/BaseNode.jsx`

---

## 2. Text Node Variable Detection

### What Changed
Text nodes automatically detect `{{variableName}}` patterns and create corresponding input handles.

### Why
- Allows users to define template variables visually
- Connects data flow between nodes dynamically

### How It Works
```javascript
// Regex extracts variable names
const regex = /\{\{(\w+)\}\}/g;
const matches = [...text.matchAll(regex)];
const variables = [...new Set(matches.map(m => m[1]))];

// Creates input handles for each variable
inputs={variables.map(v => ({ id: v, label: v }))}
```

### Example
Text: `Hello {{name}}, welcome to {{company}}!`
→ Creates 2 input handles: `name`, `company`

### Files
- `src/nodes/textNode.jsx`

---

## 3. LLM Node Updates

### What Changed
- Reduced from 2 inputs to **1 input** (Prompt only)
- Added **System Instructions** textarea

### Why
- System prompt is typically static, not connected from other nodes
- Simplifies the node while maintaining functionality

### Files
- `src/nodes/llmNode.jsx`

---

## 4. Node Delete Button

### What Changed
Added red × button that appears when hovering over a node.

### Why
- Intuitive deletion without keyboard
- Non-intrusive (hidden until hover)

### How It Works
```jsx
<button className="base-node__delete" onClick={handleDelete}>×</button>
```

### Files
- `src/nodes/BaseNode.jsx`
- `src/nodes/nodes.css`

---

## 5. Edge Delete Button

### What Changed
Added × button that appears when hovering over connection lines.

### Why
- Easy connection removal
- Visual feedback on hover

### How It Works
```jsx
// Invisible wider path for easier hover detection
<path d={edgePath} stroke="transparent" strokeWidth={20} />

// Visible delete button
<button className="edge-delete-btn">×</button>
```

### Files
- `src/CustomEdge.jsx`
- `src/index.css`

---

## 6. Undo/Redo System

### What Changed
Implemented full undo/redo with history stack.

### Keyboard Shortcuts
- `Ctrl+Z` - Undo
- `Ctrl+Y` or `Ctrl+Shift+Z` - Redo

### How It Works
```javascript
// State saved before each action
saveToHistory: () => {
  const newState = { nodes, edges };
  history.push(newState);
}

// Undo restores previous state
undo: () => {
  const prevState = history[historyIndex - 1];
  set({ nodes: prevState.nodes, edges: prevState.edges });
}
```

### Files
- `src/store.js`
- `src/ui.jsx`

---

## 7. Clear All Confirmation

### What Changed
Added confirmation modal before clearing all nodes.

### Why
- Prevents accidental data loss
- Informs user action can be undone

### Files
- `src/ui.jsx`
- `src/index.css`

---

## 8. Node Search

### What Changed
Added search bar in toolbar that filters nodes by name and keywords.

### How It Works
```javascript
const filteredNodes = allNodes.filter(node =>
  node.label.toLowerCase().includes(query) ||
  node.keywords.some(k => k.includes(query))
);
```

### Files
- `src/toolbar.jsx`
- `src/index.css`

---

## 9. Handle Tooltips

### What Changed
Hovering over connection handles shows their label.

### Why
- Helps identify inputs/outputs
- Better UX for complex nodes

### Files
- `src/nodes/BaseNode.jsx`
- `src/nodes/nodes.css`

---

## 10. Backspace Fix

### What Changed
Fixed issue where pressing Backspace in text fields would delete nodes.

### Why
- Keyboard events were captured globally instead of checking focus

### How It Works
```javascript
// Check if user is typing in an input
const isInputField = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA';
if (isInputField) return; // Don't handle delete
```

### Files
- `src/ui.jsx`

---

## 11. Backend DAG Validation

### What Changed
FastAPI endpoint validates if pipeline is a valid DAG.

### Algorithm
Uses Kahn's algorithm:
1. Count incoming edges for each node
2. Start with nodes having 0 incoming edges
3. Remove edges, repeat
4. If all nodes processed → Valid DAG

### Files
- `backend/main.py`

---

## Summary Table

| # | Change | Files | Impact |
|---|--------|-------|--------|
| 1 | BaseNode Pattern | BaseNode.jsx | Architecture |
| 2 | Variable Detection | textNode.jsx | Feature |
| 3 | LLM Node Update | llmNode.jsx | UI/UX |
| 4 | Node Delete | BaseNode.jsx, nodes.css | Feature |
| 5 | Edge Delete | CustomEdge.jsx | Feature |
| 6 | Undo/Redo | store.js, ui.jsx | Feature |
| 7 | Clear Confirmation | ui.jsx | Safety |
| 8 | Node Search | toolbar.jsx | Feature |
| 9 | Handle Tooltips | BaseNode.jsx | UX |
| 10 | Backspace Fix | ui.jsx | Bug Fix |
| 11 | DAG Validation | main.py | Backend |
