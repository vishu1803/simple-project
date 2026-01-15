import { useState } from 'react';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';

const API_URL = 'http://localhost:8000';

const selector = (state) => ({
    nodes: state.nodes,
    edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(useShallow(selector));
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

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

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/pipelines/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pipelineData),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
            setShowModal(true);
        } catch (err) {
            setError(err.message || 'Failed to analyze pipeline');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setResult(null);
        setError(null);
    };

    return (
        <>
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
                <button
                    className="submit-button"
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="submit-button__spinner"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <span className="submit-button__icon">🚀</span>
                            Submit Pipeline
                        </>
                    )}
                </button>
            </footer>

            {/* Result Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal__close" onClick={closeModal}>×</button>

                        {error ? (
                            <div className="modal__content modal__content--error">
                                <div className="modal__icon">❌</div>
                                <h2 className="modal__title">Connection Error</h2>
                                <p className="modal__message">{error}</p>
                                <p className="modal__hint">Make sure the backend server is running on port 8000</p>
                            </div>
                        ) : result && (
                            <div className={`modal__content ${result.is_dag ? 'modal__content--success' : 'modal__content--warning'}`}>
                                <div className="modal__icon">
                                    {result.is_dag ? '✅' : '⚠️'}
                                </div>
                                <h2 className="modal__title">
                                    {result.is_dag ? 'Valid Pipeline' : 'Invalid Pipeline'}
                                </h2>
                                <p className="modal__message">
                                    {result.is_dag
                                        ? 'Your pipeline is a valid Directed Acyclic Graph (DAG)!'
                                        : 'Your pipeline contains cycles and is not a valid DAG.'}
                                </p>
                                <div className="modal__stats">
                                    <div className="modal__stat">
                                        <span className="modal__stat-value">{result.num_nodes}</span>
                                        <span className="modal__stat-label">Nodes</span>
                                    </div>
                                    <div className="modal__stat">
                                        <span className="modal__stat-value">{result.num_edges}</span>
                                        <span className="modal__stat-label">Edges</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
