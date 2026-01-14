// ConditionalNode.js - Route data based on conditions (if/else logic)

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data, selected }) => {
    const [conditionType, setConditionType] = useState(data?.conditionType || 'equals');
    const [conditionValue, setConditionValue] = useState(data?.conditionValue || '');
    const updateNodeField = useStore((state) => state.updateNodeField);

    const handleConditionTypeChange = (e) => {
        setConditionType(e.target.value);
        updateNodeField(id, 'conditionType', e.target.value);
    };

    const handleConditionValueChange = (e) => {
        setConditionValue(e.target.value);
        updateNodeField(id, 'conditionValue', e.target.value);
    };

    return (
        <BaseNode
            id={id}
            title="Conditional"
            nodeType="conditional"
            icon="⚡"
            inputs={[{ id: 'input', label: 'Input' }]}
            outputs={[
                { id: 'true', label: 'True', position: 35 },
                { id: 'false', label: 'False', position: 65 }
            ]}
            selected={selected}
        >
            <div className="base-node__field">
                <label className="base-node__label">If Input</label>
                <select
                    className="base-node__select"
                    value={conditionType}
                    onChange={handleConditionTypeChange}
                >
                    <option value="equals">Equals</option>
                    <option value="notEquals">Not Equals</option>
                    <option value="isEmpty">Is Empty</option>
                    <option value="isNotEmpty">Is Not Empty</option>
                    <option value="contains">Contains</option>
                    <option value="greaterThan">Greater Than</option>
                    <option value="lessThan">Less Than</option>
                    <option value="isNumber">Is Number</option>
                    <option value="isBoolean">Is Boolean</option>
                </select>
            </div>
            {!['isEmpty', 'isNotEmpty', 'isNumber', 'isBoolean'].includes(conditionType) && (
                <div className="base-node__field">
                    <label className="base-node__label">Value</label>
                    <input
                        type="text"
                        className="base-node__input"
                        value={conditionValue}
                        onChange={handleConditionValueChange}
                        placeholder="Comparison value..."
                    />
                </div>
            )}
            <p className="base-node__description">
                Routes data to True or False output based on condition.
            </p>
        </BaseNode>
    );
};
