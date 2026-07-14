/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * AuthContext — Gestión de sesión del usuario autenticado.
 *
 * La autenticación se delega completamente al backend (POST /api/login).
 * La sesión se persiste en sessionStorage (se limpia al cerrar el navegador).
 * Las contraseñas nunca se almacenan en el frontend.
 */

const AuthContext = createContext(null);

const rolePermissions = {
  Administrador: ['inicio', 'dashboard', 'entradas', 'salidas', 'inventarios', 'reportes', 'usuarios'],
  Supervisor: ['inicio', 'entradas', 'salidas', 'inventarios', 'usuarios'],
  Operario: ['entradas', 'salidas', 'reportes']
};

const routeSections = [
  { section: 'inicio', match: (path) => path === '/Inicio' || path === '/' },
  { section: 'dashboard', match: (path) => path === '/Dashboard' },
  { section: 'entradas', match: (path) => path === '/Entradas' },
  { section: 'salidas', match: (path) => path === '/Salidas' },
  { section: 'inventarios', match: (path) => path.startsWith('/Inventarios') },
  { section: 'reportes', match: (path) => path === '/Historial-De-Movimientos' },
  { section: 'usuarios', match: (path) => path.startsWith('/usuarios') }
];

const getAllowedSections = (role) => rolePermissions[role] || [];

export const canAccessPath = (role, path) => {
  const matchedSection = routeSections.find((route) => route.match(path));
  if (!matchedSection) {
    return false;
  }
  return getAllowedSections(role).includes(matchedSection.section);
};

export const getDefaultPathForRole = (role) => {
  if (canAccessPath(role, '/Inicio')) {
    return '/Inicio';
  }
  if (canAccessPath(role, '/Entradas')) {
    return '/Entradas';
  }
  return '/login';
};

export const AuthProvider = ({ children }) => {
  // Rehidratar sesión desde sessionStorage al montar la app
  const [user, setUser] = useState(function () {
    const savedSession = sessionStorage.getItem('session_user');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch {
        return null;
      }
    }
    return null;
  });
  const loading = false;

  // Persistir sesión en sessionStorage cuando cambia el usuario
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('session_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('session_user');
    }
  }, [user]);

  /**
   * login — Delega la autenticación al backend.
   * Recibe el objeto de respuesta del servicio (con { success, user } o { error }).
   */
  const login = useCallback((respuestaBackend) => {
    if (respuestaBackend?.success && respuestaBackend?.user) {
      setUser(respuestaBackend.user);
      return { success: true };
    }
    return {
      success: false,
      error: respuestaBackend?.error || 'Credenciales inválidas.'
    };
  }, []);

  // Cierra sesión (limpia estado y sessionStorage)
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Función vacía de compatibilidad para evitar que main.jsx falle
  const syncUser = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
