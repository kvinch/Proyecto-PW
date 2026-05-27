import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from '../components/Login/Login.jsx'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Sidebar/>
    </BrowserRouter>
  </StrictMode>,
)
