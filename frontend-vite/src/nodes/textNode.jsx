// textNode.js

import { useState, useEffect, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [dynamicOutputs, setDynamicOutputs] = useState([]);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const textareaRef = useRef(null);

  // Extract variables from text (e.g., {{variable}})
  useEffect(() => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const variables = [...new Set(matches.map(m => m[1]))];

    // Create input handles for each unique variable
    const newOutputs = variables.map((variable, index) => ({
      id: variable,
      label: variable,
    }));

    setDynamicOutputs(newOutputs);
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <BaseNode
      id={id}
      title="Text"
      nodeType="text"
      icon="📝"
      outputs={[{ id: 'output', label: 'Text' }]}
      inputs={dynamicOutputs.length > 0 ? dynamicOutputs.map((v, i) => ({
        id: v.id,
        label: v.label,
        position: dynamicOutputs.length === 1 ? 50 : (100 / (dynamicOutputs.length + 1)) * (i + 1)
      })) : []}
      selected={selected}
    >
      <div className="base-node__field">
        <label className="base-node__label">Content</label>
        <textarea
          ref={textareaRef}
          className="base-node__textarea"
          value={currText}
          onChange={handleTextChange}
          placeholder="Enter text. Use {{variable}} for dynamic inputs."
          rows={3}
        />
      </div>
      {dynamicOutputs.length > 0 && (
        <p className="base-node__description">
          Variables: {dynamicOutputs.map(v => v.id).join(', ')}
        </p>
      )}
    </BaseNode>
  );
};
