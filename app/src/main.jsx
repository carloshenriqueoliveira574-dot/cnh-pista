import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Crashed from './screens/Crashed.jsx'
import { initSentry, SentryErrorBoundary } from './lib/sentry.js'

initSentry()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SentryErrorBoundary fallback={({ resetError }) => <Crashed resetError={resetError} />}>
      <App />
    </SentryErrorBoundary>
  </StrictMode>,
)
