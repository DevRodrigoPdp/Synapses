import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Añadimos el basename para que coincida con tu repositorio */}
    <BrowserRouter basename="/Synapses">
      <App />
    </BrowserRouter>
  </StrictMode>
)