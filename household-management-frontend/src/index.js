import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the createRoot method
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Only wrap in Router here */}
      <App />
    </Router>
  </React.StrictMode>
);
