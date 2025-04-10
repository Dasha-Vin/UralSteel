import React from 'react';
import ReactDOM from 'react-dom/client';
import './reset.css'
import './index.css'
import App from './App'
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);