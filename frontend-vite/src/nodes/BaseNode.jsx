// BaseNode.js - Reusable base component for all React Flow nodes

import { Handle, Position } from "@xyflow/react";
import { useStore } from '../store';
import './nodes.css';

/**
 * BaseNode - A reusable node component that provides consistent styling
 * and dynamic handle configuration for React Flow nodes.
 * 
 * @param {Object} props
 * @param {string} props.id - Unique node identifier
 * @param {string} props.title - Node header title
 * @param {string} props.nodeType - Node type for styling (e.g., 'input', 'output', 'llm')
 * @param {string} [props.icon] - Optional icon/emoji for the header
 * @param {Array} [props.inputs] - Array of input handle configurations
 * @param {Array} [props.outputs] - Array of output handle configurations
 * @param {React.ReactNode} props.children - Custom content for the node body
 * @param {boolean} [props.selected] - Whether the node is selected
 * 
 * Handle configuration object:
 * {
 *   id: string,           // Unique handle identifier
 *   label?: string,       // Optional label to display
 *   position?: number,    // Optional vertical position (percentage, 0-100)
 * }
 */
export const BaseNode = ({
    id,
    title,
    nodeType = 'default',
    icon,
    inputs = [],
    outputs = [],
    children,
    selected = false
}) => {
    const deleteNode = useStore((state) => state.deleteNode);

    // Calculate handle positions for multiple handles
    const calculatePosition = (index, total) => {
        if (total === 1) return 50;
        const spacing = 100 / (total + 1);
        return spacing * (index + 1);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        deleteNode(id);
    };

    return (
        <div className={`base-node base-node--${nodeType} ${selected ? 'selected' : ''}`}>
            {/* Delete Button */}
            <button
                className="base-node__delete"
                onClick={handleDeleteClick}
                title="Delete node"
            >
                ×
            </button>

            {/* Input Handles - with tooltips */}
            {inputs.map((input, index) => (
                <div
                    key={`input-wrapper-${input.id}`}
                    className="handle-wrapper handle-wrapper--left"
                    style={{
                        top: `${input.position || calculatePosition(index, inputs.length)}%`
                    }}
                >
                    <Handle
                        key={`input-${input.id}`}
                        type="target"
                        position={Position.Left}
                        id={`${id}-${input.id}`}
                        className="handle-with-tooltip"
                    />
                    {input.label && (
                        <span className="handle-tooltip handle-tooltip--left">{input.label}</span>
                    )}
                </div>
            ))}

            {/* Output Handles - with tooltips */}
            {outputs.map((output, index) => (
                <div
                    key={`output-wrapper-${output.id}`}
                    className="handle-wrapper handle-wrapper--right"
                    style={{
                        top: `${output.position || calculatePosition(index, outputs.length)}%`
                    }}
                >
                    <Handle
                        key={`output-${output.id}`}
                        type="source"
                        position={Position.Right}
                        id={`${id}-${output.id}`}
                        className="handle-with-tooltip"
                    />
                    {output.label && (
                        <span className="handle-tooltip handle-tooltip--right">{output.label}</span>
                    )}
                </div>
            ))}


            {/* Header */}
            <div className="base-node__header">
                {icon && <span className="base-node__icon">{icon}</span>}
                <span className="base-node__title">{title}</span>
            </div>

            {/* Body / Children */}
            <div className="base-node__body">
                {children}
            </div>
        </div>
    );
};

export default BaseNode;
