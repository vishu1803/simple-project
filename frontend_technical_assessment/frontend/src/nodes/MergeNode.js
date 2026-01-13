// MergeNode.js - Combine multiple inputs into one output

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MergeNode = ({ id, data, selected }) => {
    const [mergeStrategy, setMergeStrategy] = useState(data?.mergeStrategy || 'concat');
    const [delimiter, setDelimiter] = useState(data?.delimiter || ', ');
    const updateNodeField = useStore((state) => state.updateNodeField);

    const handleStrategyChange = (e) => {
        setMergeStrategy(e.target.value);
        updateNodeField(id, 'mergeStrategy', e.target.value);
    };

    const handleDelimiterChange = (e) => {
        setDelimiter(e.target.value);
        updateNodeField(id, 'delimiter', e.target.value);
    };

    const needsDelimiter = ['join', 'joinLines'].includes(mergeStrategy);

    return (
        <BaseNode
            id={id}
            title="Merge"
            nodeType="merge"
            icon="🔗"
            inputs={[
                { id: 'input1', label: 'Input 1', position: 25 },
                { id: 'input2', label: 'Input 2', position: 50 },
                { id: 'input3', label: 'Input 3', position: 75 }
            ]}
            outputs={[{ id: 'output', label: 'Merged' }]}
            selected={selected}
        >
            <div className="base-node__field">
                <label className="base-node__label">Strategy</label>
                <select
                    className="base-node__select"
                    value={mergeStrategy}
                    onChange={handleStrategyChange}
                >
                    <option value="concat">Concatenate</option>
                    <option value="join">Join with Delimiter</option>
                    <option value="joinLines">Join as Lines</option>
                    <option value="array">As Array</option>
                    <option value="object">As Object</option>
                    <option value="first">First Non-Empty</option>
                    <option value="last">Last Non-Empty</option>
                </select>
            </div>
            {needsDelimiter && (
                <div className="base-node__field">
                    <label className="base-node__label">Delimiter</label>
                    <input
                        type="text"
                        className="base-node__input"
                        value={delimiter}
                        onChange={handleDelimiterChange}
                        placeholder="Enter delimiter..."
                    />
                </div>
            )}
            <p className="base-node__description">
                Combines up to 3 inputs into a single output.
            </p>
        </BaseNode>
    );
};
