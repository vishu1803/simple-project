// BaseNode.js - Reusable base component for all React Flow nodes

import { Handle, Position } from "@xyflow/react";
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
    // Calculate handle positions for multiple handles
    const calculatePosition = (index, total) => {
        if (total === 1) return 50;
        const spacing = 100 / (total + 1);
        return spacing * (index + 1);
    };

    return (
        <div className={`base-node base-node--${nodeType} ${selected ? 'selected' : ''}`}>
            {/* Input Handles - directly inside the node for React Flow */}
            {inputs.map((input, index) => (
                <Handle
                    key={`input-${input.id}`}
                    type="target"
                    position={Position.Left}
                    id={`${id}-${input.id}`}
                    style={{
                        top: `${input.position || calculatePosition(index, inputs.length)}%`
                    }}
                />
            ))}

            {/* Output Handles - directly inside the node for React Flow */}
            {outputs.map((output, index) => (
                <Handle
                    key={`output-${output.id}`}
                    type="source"
                    position={Position.Right}
                    id={`${id}-${output.id}`}
                    style={{
                        top: `${output.position || calculatePosition(index, outputs.length)}%`
                    }}
                />
            ))}

            {/* Handle Labels (separate from Handles for proper positioning) */}
            {inputs.map((input, index) => (
                input.label && (
                    <span
                        key={`label-input-${input.id}`}
                        className="handle-label handle-label--left"
                        style={{
                            top: `${input.position || calculatePosition(index, inputs.length)}%`
                        }}
                    >
                        {input.label}
                    </span>
                )
            ))}
            {outputs.map((output, index) => (
                output.label && (
                    <span
                        key={`label-output-${output.id}`}
                        className="handle-label handle-label--right"
                        style={{
                            top: `${output.position || calculatePosition(index, outputs.length)}%`
                        }}
                    >
                        {output.label}
                    </span>
                )
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
