import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { ApiProvider } from './context/ApiContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ApiProvider>
        <App />
      </ApiProvider>
    </Router>
  </StrictMode>
)
