import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Option 1 : Vite (recommandé)
const apiUrl = import.meta.env.VITE_API_URL;
console.log("VITE_API_URL:", apiUrl);

// Option 2 : Fallback avec process.env
const apiUrlFallback = process.env.VITE_API_URL || "https://url-par-defaut.com";
console.log("Fallback API URL:", apiUrlFallback);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
