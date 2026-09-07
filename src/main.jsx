import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ maxWidth: 640, margin: '80px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong.</h1>
          <p style={{ color: '#555', marginBottom: 16 }}>The page hit an error. Try reloading. If it persists, share this message:</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: 12, borderRadius: 8, fontSize: 12 }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '10px 16px', background: '#0F766E', color: '#fff', border: 0, borderRadius: 8, fontWeight: 700 }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
