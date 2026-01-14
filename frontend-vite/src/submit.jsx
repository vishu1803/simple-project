import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(useShallow(selector));

    const handleSubmit = async () => {
        const pipelineData = {
            nodes: nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data,
            })),
            edges: edges.map((edge) => ({
                source: edge.source,
                sourceHandle: edge.sourceHandle,
                target: edge.target,
                targetHandle: edge.targetHandle,
            })),
        };

        console.log('Pipeline Data:', pipelineData);

        alert(
            `Pipeline submitted!\n\nNodes: ${nodes.length}\nConnections: ${edges.length}`
        );
    };

    return (
        <footer className="footer">
            <div className="footer__info">
                <div className="footer__stat">
                    <span className="footer__stat-icon">📦</span>
                    <span>{nodes.length} nodes</span>
                </div>
                <div className="footer__stat">
                    <span className="footer__stat-icon">🔗</span>
                    <span>{edges.length} connections</span>
                </div>
            </div>
            <button className="submit-button" type="button" onClick={handleSubmit}>
                <span className="submit-button__icon">🚀</span>
                Submit Pipeline
            </button>
        </footer>
    );
};
