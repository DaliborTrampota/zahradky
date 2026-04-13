/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import App from './App.jsx'

// Redirect invite tokens to /invite before the app mounts
if (window.location.hash.includes('type=invite') && window.location.pathname === '/') {
  window.location.replace('/invite' + window.location.hash)
}

const root = document.getElementById('root')

render(() => <App />, root)
