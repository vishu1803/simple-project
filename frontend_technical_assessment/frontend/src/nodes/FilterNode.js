// FilterNode.js - Filter data based on conditions

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data, selected }) => {
    const [filterType, setFilterType] = useState(data?.filterType || 'contains');
    const [filterValue, setFilterValue] = useState(data?.filterValue || '');
    const updateNodeField = useStore((state) => state.updateNodeField);

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
        updateNodeField(id, 'filterType', e.target.value);
    };

    const handleFilterValueChange = (e) => {
        setFilterValue(e.target.value);
        updateNodeField(id, 'filterValue', e.target.value);
    };

    return (
        <BaseNode
            id={id}
            title="Filter"
            nodeType="filter"
            icon="🔍"
            inputs={[{ id: 'input', label: 'Data' }]}
            outputs={[
                { id: 'matched', label: 'Matched', position: 35 },
                { id: 'unmatched', label: 'Unmatched', position: 65 }
            ]}
            selected={selected}
        >
            <div className="base-node__field">
                <label className="base-node__label">Condition</label>
                <select
                    className="base-node__select"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                >
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="startsWith">Starts With</option>
                    <option value="endsWith">Ends With</option>
                    <option value="regex">Regex Match</option>
                    <option value="greaterThan">Greater Than</option>
                    <option value="lessThan">Less Than</option>
                </select>
            </div>
            <div className="base-node__field">
                <label className="base-node__label">Value</label>
                <input
                    type="text"
                    className="base-node__input"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    placeholder="Filter value..."
                />
            </div>
        </BaseNode>
    );
};
