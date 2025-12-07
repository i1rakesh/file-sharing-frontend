import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // 👈 NEW IMPORT
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 👈 Wrap with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);