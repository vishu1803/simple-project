// CustomEdge.jsx - Custom edge component with delete button

import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import { useStore } from './store';
import { useState } from 'react';

export const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
}) => {
    const deleteEdge = useStore((state) => state.deleteEdge);
    const [isHovered, setIsHovered] = useState(false);

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16,
    });

    const onEdgeClick = (evt) => {
        evt.stopPropagation();
        deleteEdge(id);
    };

    return (
        <>
            {/* Invisible wider path for easier hovering */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ cursor: 'pointer' }}
            />
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: selected ? 2.5 : 2,
                    stroke: selected ? '#6366f1' : '#94a3b8',
                }}
            />
            <EdgeLabelRenderer>
                <div
                    className={`edge-delete-button ${selected || isHovered ? 'visible' : ''}`}
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button
                        className="edge-delete-btn"
                        onClick={onEdgeClick}
                        title="Delete connection"
                    >
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default CustomEdge;
