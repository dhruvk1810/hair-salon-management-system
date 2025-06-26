import React from 'react';
import ReactDOM from 'react-dom/client';  // updated import for React 18+
import App from './App';

// Create a root element for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app to the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
