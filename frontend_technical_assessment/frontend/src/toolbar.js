// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="toolbar">
            <div className="toolbar__title">Node Library</div>
            <div className="toolbar__groups">
                {/* Core I/O Nodes */}
                <div className="toolbar__group">
                    <div className="toolbar__group-title">Input / Output</div>
                    <div className="toolbar__nodes">
                        <DraggableNode type="customInput" label="Input" icon="📥" />
                        <DraggableNode type="customOutput" label="Output" icon="📤" />
                    </div>
                </div>

                {/* AI / Text Nodes */}
                <div className="toolbar__group">
                    <div className="toolbar__group-title">AI & Text</div>
                    <div className="toolbar__nodes">
                        <DraggableNode type="llm" label="LLM" icon="🤖" />
                        <DraggableNode type="text" label="Text" icon="📝" />
                    </div>
                </div>

                {/* Processing Nodes */}
                <div className="toolbar__group">
                    <div className="toolbar__group-title">Processing</div>
                    <div className="toolbar__nodes">
                        <DraggableNode type="filter" label="Filter" icon="🔍" />
                        <DraggableNode type="transform" label="Transform" icon="🔄" />
                        <DraggableNode type="merge" label="Merge" icon="🔗" />
                    </div>
                </div>

                {/* Logic & Integration Nodes */}
                <div className="toolbar__group">
                    <div className="toolbar__group-title">Logic & Integration</div>
                    <div className="toolbar__nodes">
                        <DraggableNode type="conditional" label="Conditional" icon="⚡" />
                        <DraggableNode type="api" label="API Request" icon="🌐" />
                    </div>
                </div>
            </div>
        </div>
    );
};
