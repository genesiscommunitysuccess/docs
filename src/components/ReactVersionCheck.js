import React from 'react';

function ReactVersionCheck() {
  return (
    <div>
      <p>React version: {React.version}</p>
      {React.version.startsWith('19') ? (
        <p style={{ color: 'green' }}>You are using React v19!</p>
      ) : (
        <p style={{ color: 'red' }}>React v19 is not in use.</p>
      )}
    </div>
  );
}

export default ReactVersionCheck;