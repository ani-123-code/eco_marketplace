import React from 'react'
import ReactDOM from 'react-dom/client'
import EcoApp from './EcoApp.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <EcoApp />
    </ErrorBoundary>
  </React.StrictMode>,
)
