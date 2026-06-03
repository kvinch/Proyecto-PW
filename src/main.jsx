import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import UsuariosPage from './pages/usuarioPage.jsx';
import RegistroUsuarioPage from './pages/registroUsuarioPage.jsx';
import InventarioPage from './pages/inventarioPage.jsx';
import EntradasPage from './pages/entradasPage.jsx';
import SalidasPage from './pages/salidasPage.jsx';
import RegistroProducto from '../components/Inventario/RegistroProducto.jsx';
import InicioPage from './pages/inicioPage.jsx';
import DashboardPage from './pages/dashboardPage.jsx';
import InventarioResumenPage from './pages/inventarioResumenPage.jsx';
import LoginPage from './pages/loginPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Componente para proteger las rutas privadas y manejar el layout responsivo
function ProtectedRouteLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Manejar colapso automático del sidebar según el tamaño de la pantalla
  useEffect(() => {
    function manejarTamaño() {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }
    window.addEventListener('resize', manejarTamaño);
    manejarTamaño();
    return () => window.removeEventListener('resize', manejarTamaño);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className={`flex-1 p-6 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Outlet />
      </main>
    </div>
  );
}

// Componente para evitar ingresar a login si ya se está autenticado
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/Inicio" replace />;
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta Pública (Login) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />

          {/* Rutas Privadas / Protegidas */}
          <Route element={<ProtectedRouteLayout />}>
            <Route path="/Inicio" element={<InicioPage />} />
            <Route path="/Inventarios" element={<InventarioPage />} />
            <Route path="/Inventarios/nuevo" element={<RegistroProducto />} />
            <Route path="/Inventarios/editar/:id" element={<RegistroProducto />} />
            <Route path="/Entradas" element={<EntradasPage />} />
            <Route path="/Salidas" element={<SalidasPage />} />
            <Route path="/Dashboard" element={<DashboardPage />} />
            <Route path="/Historial De Movimientos" element={<InventarioResumenPage />} />

            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/usuarios/nuevo" element={<RegistroUsuarioPage />} />
            <Route path="/usuarios/editar/:id" element={<RegistroUsuarioPage />} />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/Inicio" replace />} />
          </Route>

          {/* Redirección para cualquier otra URL no válida */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
