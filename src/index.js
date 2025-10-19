import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { CxCProgressProvider } from './contexts/CxCProgressContext'; // ✅ Importar el provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 🆕 TEMPORALMENTE comentar StrictMode para testing
  // <React.StrictMode>
    <CxCProgressProvider>
      <App />
    </CxCProgressProvider>
  // </React.StrictMode>
);
