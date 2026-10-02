import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GasLabProvider } from './state/GasLabContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GasLabProvider>
      <App />
    </GasLabProvider>
  </React.StrictMode>,
);