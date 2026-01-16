// llmNode.js

import { useState, useRef, useEffect, useCallback } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data, selected }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const [systemPrompt, setSystemPrompt] = useState(data?.systemPrompt || '');
  const updateNodeField = useStore((state) => state.updateNodeField);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [systemPrompt, resizeTextarea]);

  const handleModelChange = (e) => {
    setModel(e.target.value);
    updateNodeField(id, 'model', e.target.value);
  };

  const handleSystemPromptChange = (e) => {
    setSystemPrompt(e.target.value);
    updateNodeField(id, 'systemPrompt', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="LLM"
      nodeType="llm"
      icon="🤖"
      inputs={[
        { id: 'prompt', label: 'Prompt' }
      ]}
      outputs={[{ id: 'response', label: 'Response' }]}
      selected={selected}
    >
      <div className="base-node__field">
        <label className="base-node__label">Model</label>
        <select
          className="base-node__select"
          value={model}
          onChange={handleModelChange}
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3">Claude 3</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>
      <div className="base-node__field">
        <label className="base-node__label">System Instructions</label>
        <textarea
          ref={textareaRef}
          className="base-node__textarea"
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          placeholder="Enter instructions for the AI model..."
          rows={2}
        />
      </div>
    </BaseNode>
  );
};
