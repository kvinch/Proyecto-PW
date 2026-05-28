import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UsuariosPage from './pages/usuarioPage.jsx';
import RegistroUsuarioPage from './pages/registroUsuarioPage.jsx';
import InventarioPage from './pages/inventarioPage.jsx';
import RegistroProducto from '../components/Inventario/RegistroProducto.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/Inicio" element={<div>1</div>} />
            <Route path="/Inventarios" element={<InventarioPage />} />
            <Route path="/Inventarios/nuevo" element={<RegistroProducto />} />
            <Route path="/Inventarios/editar/:id" element={<RegistroProducto />} />
            <Route path="/Dashboard" element={<div>3</div>} />
            <Route path="/Historial De Movimientos" element={<div>4</div>} />

            <Route path="/" element={<Navigate to="/usuarios" replace />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/usuarios/nuevo" element={<RegistroUsuarioPage />} />
            <Route path="/usuarios/editar/:id" element={<RegistroUsuarioPage />} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </StrictMode>
);
