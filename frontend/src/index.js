import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// You might need to create a simple CSS file later for basic styling,
// but for now, we'll keep it simple.
// import './index.css'; 

// Get the root DOM element from index.html
const container = document.getElementById('root');

// Create a React root and render the App component
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);