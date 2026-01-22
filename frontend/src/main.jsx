import { AuthProvider } from "./context/AuthProvider.jsx";
import ReactDOM from "react-dom/client";
import React from "react";
import App from './App.jsx'
import './input.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
