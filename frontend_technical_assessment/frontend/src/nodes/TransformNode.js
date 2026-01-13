// TransformNode.js - Transform/modify data

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TransformNode = ({ id, data, selected }) => {
    const [transformType, setTransformType] = useState(data?.transformType || 'uppercase');
    const [customValue, setCustomValue] = useState(data?.customValue || '');
    const updateNodeField = useStore((state) => state.updateNodeField);

    const handleTransformTypeChange = (e) => {
        setTransformType(e.target.value);
        updateNodeField(id, 'transformType', e.target.value);
    };

    const handleCustomValueChange = (e) => {
        setCustomValue(e.target.value);
        updateNodeField(id, 'customValue', e.target.value);
    };

    const needsCustomValue = ['prefix', 'suffix', 'replace', 'split'].includes(transformType);

    return (
        <BaseNode
            id={id}
            title="Transform"
            nodeType="transform"
            icon="🔄"
            inputs={[{ id: 'input', label: 'Input' }]}
            outputs={[{ id: 'output', label: 'Output' }]}
            selected={selected}
        >
            <div className="base-node__field">
                <label className="base-node__label">Transform</label>
                <select
                    className="base-node__select"
                    value={transformType}
                    onChange={handleTransformTypeChange}
                >
                    <option value="uppercase">Uppercase</option>
                    <option value="lowercase">Lowercase</option>
                    <option value="capitalize">Capitalize</option>
                    <option value="trim">Trim Whitespace</option>
                    <option value="reverse">Reverse</option>
                    <option value="prefix">Add Prefix</option>
                    <option value="suffix">Add Suffix</option>
                    <option value="split">Split by Delimiter</option>
                    <option value="length">Get Length</option>
                    <option value="json">Parse JSON</option>
                </select>
            </div>
            {needsCustomValue && (
                <div className="base-node__field">
                    <label className="base-node__label">
                        {transformType === 'prefix' ? 'Prefix' :
                            transformType === 'suffix' ? 'Suffix' :
                                transformType === 'split' ? 'Delimiter' : 'Value'}
                    </label>
                    <input
                        type="text"
                        className="base-node__input"
                        value={customValue}
                        onChange={handleCustomValueChange}
                        placeholder="Enter value..."
                    />
                </div>
            )}
        </BaseNode>
    );
};
