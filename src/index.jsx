import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app.jsx'
import './index.css'
import Modal from 'react-modal';
import { BrowserRouter } from "react-router-dom";

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/'>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
