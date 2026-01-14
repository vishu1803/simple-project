// APINode.js - Make HTTP API requests

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const APINode = ({ id, data, selected }) => {
    const [method, setMethod] = useState(data?.method || 'GET');
    const [url, setUrl] = useState(data?.url || '');
    const [headers, setHeaders] = useState(data?.headers || '');
    const updateNodeField = useStore((state) => state.updateNodeField);

    const handleMethodChange = (e) => {
        setMethod(e.target.value);
        updateNodeField(id, 'method', e.target.value);
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
        updateNodeField(id, 'url', e.target.value);
    };

    const handleHeadersChange = (e) => {
        setHeaders(e.target.value);
        updateNodeField(id, 'headers', e.target.value);
    };

    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

    return (
        <BaseNode
            id={id}
            title="API Request"
            nodeType="api"
            icon="🌐"
            inputs={hasBody ? [
                { id: 'body', label: 'Body', position: 35 },
                { id: 'params', label: 'Params', position: 65 }
            ] : [
                { id: 'params', label: 'Params' }
            ]}
            outputs={[
                { id: 'response', label: 'Response', position: 35 },
                { id: 'error', label: 'Error', position: 65 }
            ]}
            selected={selected}
        >
            <div className="base-node__row">
                <div className="base-node__field" style={{ flex: '0 0 80px' }}>
                    <label className="base-node__label">Method</label>
                    <select
                        className="base-node__select"
                        value={method}
                        onChange={handleMethodChange}
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
                <div className="base-node__field" style={{ flex: 1 }}>
                    <label className="base-node__label">URL</label>
                    <input
                        type="text"
                        className="base-node__input"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="https://api.example.com/..."
                    />
                </div>
            </div>
            <div className="base-node__field">
                <label className="base-node__label">Headers (JSON)</label>
                <input
                    type="text"
                    className="base-node__input"
                    value={headers}
                    onChange={handleHeadersChange}
                    placeholder='{"Authorization": "Bearer ..."}'
                />
            </div>
        </BaseNode>
    );
};
