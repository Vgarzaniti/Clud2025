import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContext } from './context/AuthContext.jsx'
import App from './App.jsx'
import './input.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
      <App />
    </AuthContext>
  </StrictMode>,
)
