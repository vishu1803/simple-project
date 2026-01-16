// toolbar.js

import { useState, useMemo } from 'react';
import { DraggableNode } from './draggableNode';

// All available nodes with metadata
const allNodes = [
    { type: 'customInput', label: 'Input', icon: '📥', category: 'io', keywords: ['input', 'data', 'source', 'entry'] },
    { type: 'customOutput', label: 'Output', icon: '📤', category: 'io', keywords: ['output', 'result', 'destination', 'exit'] },
    { type: 'llm', label: 'LLM', icon: '🤖', category: 'ai', keywords: ['llm', 'ai', 'gpt', 'claude', 'model', 'language'] },
    { type: 'text', label: 'Text', icon: '📝', category: 'ai', keywords: ['text', 'template', 'string', 'content'] },
    { type: 'filter', label: 'Filter', icon: '🔍', category: 'processing', keywords: ['filter', 'condition', 'search', 'find'] },
    { type: 'transform', label: 'Transform', icon: '🔄', category: 'processing', keywords: ['transform', 'convert', 'modify', 'change'] },
    { type: 'merge', label: 'Merge', icon: '🔗', category: 'processing', keywords: ['merge', 'combine', 'join', 'concat'] },
    { type: 'conditional', label: 'Conditional', icon: '⚡', category: 'logic', keywords: ['conditional', 'if', 'else', 'branch', 'switch'] },
    { type: 'api', label: 'API Request', icon: '🌐', category: 'logic', keywords: ['api', 'http', 'request', 'fetch', 'rest'] },
];

const categories = {
    io: { title: 'Input / Output', order: 1 },
    ai: { title: 'AI & Text', order: 2 },
    processing: { title: 'Processing', order: 3 },
    logic: { title: 'Logic & Integration', order: 4 },
};

export const PipelineToolbar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter nodes based on search query
    const filteredNodes = useMemo(() => {
        if (!searchQuery.trim()) {
            return allNodes;
        }
        const query = searchQuery.toLowerCase();
        return allNodes.filter(node =>
            node.label.toLowerCase().includes(query) ||
            node.type.toLowerCase().includes(query) ||
            node.keywords.some(keyword => keyword.includes(query))
        );
    }, [searchQuery]);

    // Group filtered nodes by category
    const groupedNodes = useMemo(() => {
        const groups = {};
        filteredNodes.forEach(node => {
            if (!groups[node.category]) {
                groups[node.category] = [];
            }
            groups[node.category].push(node);
        });
        return groups;
    }, [filteredNodes]);

    // Sort categories by order
    const sortedCategories = Object.keys(groupedNodes).sort(
        (a, b) => categories[a].order - categories[b].order
    );

    return (
        <div className="toolbar">
            <div className="toolbar__header">
                <div className="toolbar__title">Node Library</div>
                <div className="toolbar__search">
                    <span className="toolbar__search-icon">🔍</span>
                    <input
                        type="text"
                        className="toolbar__search-input"
                        placeholder="Search nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="toolbar__search-clear"
                            onClick={() => setSearchQuery('')}
                            title="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {filteredNodes.length === 0 ? (
                <div className="toolbar__empty">
                    <span>No nodes found matching "{searchQuery}"</span>
                </div>
            ) : (
                <div className="toolbar__groups">
                    {sortedCategories.map((category) => (
                        <div className="toolbar__group" key={category}>
                            <div className="toolbar__group-title">{categories[category].title}</div>
                            <div className="toolbar__nodes">
                                {groupedNodes[category].map((node) => (
                                    <DraggableNode
                                        key={node.type}
                                        type={node.type}
                                        label={node.label}
                                        icon={node.icon}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
