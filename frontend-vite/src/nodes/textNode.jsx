// textNode.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [dynamicOutputs, setDynamicOutputs] = useState([]);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const textareaRef = useRef(null);

  // Auto-resize textarea function
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to fit content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

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

  // Auto-resize textarea on mount and when content changes
  useEffect(() => {
    resizeTextarea();
  }, [currText, resizeTextarea]);

  // Also resize on window resize
  useEffect(() => {
    window.addEventListener('resize', resizeTextarea);
    return () => window.removeEventListener('resize', resizeTextarea);
  }, [resizeTextarea]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
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
