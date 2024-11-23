import React from 'react';

const Loading = () => {
  const spinnerStyle = {
    fontSize: '40px',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={spinnerStyle}>🐾</div>
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg) scale(2);
            }
            50% {
              transform: rotate(180deg) scale(2.5); 
            }
            100% {
              transform: rotate(360deg) scale(2); 
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
