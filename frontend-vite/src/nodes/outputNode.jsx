// outputNode.js

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'outputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, 'outputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Output"
      nodeType="output"
      icon="📤"
      inputs={[{ id: 'value', label: 'Input' }]}
      selected={selected}
    >
      <div className="base-node__field">
        <label className="base-node__label">Name</label>
        <input
          type="text"
          className="base-node__input"
          value={currName}
          onChange={handleNameChange}
          placeholder="Enter output name"
        />
      </div>
      <div className="base-node__field">
        <label className="base-node__label">Type</label>
        <select
          className="base-node__select"
          value={outputType}
          onChange={handleTypeChange}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
