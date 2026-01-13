// draggableNode.js

export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Map type to class name for styling
  const getNodeClass = (nodeType) => {
    const typeMap = {
      'customInput': 'input',
      'customOutput': 'output',
    };
    return typeMap[nodeType] || nodeType;
  };

  return (
    <div
      className={`draggable-node draggable-node--${getNodeClass(type)}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      {icon && <span className="draggable-node__icon">{icon}</span>}
      <span className="draggable-node__label">{label}</span>
    </div>
  );
};