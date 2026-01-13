// llmNode.js

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data, selected }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleModelChange = (e) => {
    setModel(e.target.value);
    updateNodeField(id, 'model', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="LLM"
      nodeType="llm"
      icon="🤖"
      inputs={[
        { id: 'system', label: 'System', position: 33 },
        { id: 'prompt', label: 'Prompt', position: 66 }
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
      <p className="base-node__description">
        Processes system prompt and user input to generate AI responses.
      </p>
    </BaseNode>
  );
};
