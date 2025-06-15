import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './style.css'

// 渲染应用
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
