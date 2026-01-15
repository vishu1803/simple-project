// CustomEdge.jsx - Custom edge component with delete button

import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath } from '@xyflow/react';
import { useStore } from './store';

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
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: selected ? 2 : 1.5,
                    stroke: selected ? '#818cf8' : '#6366f1',
                }}
            />
            <EdgeLabelRenderer>
                <div
                    className={`edge-delete-button ${selected ? 'visible' : ''}`}
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                    }}
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
