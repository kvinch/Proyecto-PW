import { createContext, useContext, useState, useEffect } from 'react';
import seedUsers from '../data/seedUsers';

/**
 * LIMITACIÓN DE SEGURIDAD — Proyecto Académico (sin backend)
 *
 * - El control de roles es exclusivamente visual y alterable desde DevTools. (M4)
 * - Las contraseñas se almacenan en texto plano en localStorage (A2), ya que no
 *   existe un backend que gestione hashing seguro (ej. bcrypt).
 * - Las contraseñas de los usuarios seed (defaultUsers) quedan visibles en el
 *   bundle de producción (dist/assets/index-*.js) al estar hardcodeadas.
 * - Estas limitaciones son aceptables únicamente en un contexto académico.
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

// Se usa seedUsers importado desde src/data/seedUsers.js como fuente única de datos

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

// C1 FIX: Solo inserta usuarios seed que no existen. Nunca sobrescribe datos ya existentes.
const asegurarUsuariosPorDefecto = () => {
  const savedUsersStr = localStorage.getItem('usuarios_app');
  let users = [];
  
  if (savedUsersStr) {
    try {
      users = JSON.parse(savedUsersStr);
    } catch (e) {
      console.error("Error al leer usuarios:", e);
    }
  }

  let modificado = false;

  if (!Array.isArray(users)) {
    users = [...seedUsers];
    modificado = true;
  } else {
    // Solo insertamos el seed si no existe aún; nunca sobrescribimos datos editados
    seedUsers.forEach((defUser) => {
      const existingIndex = users.findIndex(
        (u) => u.usuario.toLowerCase() === defUser.usuario.toLowerCase()
      );

      if (existingIndex === -1) {
        users.push(defUser);
        modificado = true;
      }
      // Si ya existe, no se toca — las ediciones del usuario se preservan
    });
  }

  if (modificado) {
    localStorage.setItem('usuarios_app', JSON.stringify(users));
  }

  return users;
};

const obtenerUsuarioActualizado = (currentUser) => {
  if (!currentUser?.usuario) {
    return null;
  }

  const users = asegurarUsuariosPorDefecto();
  const normalizedUsername = currentUser.usuario.toLowerCase();
  return users.find((storedUser) => storedUser.usuario.toLowerCase() === normalizedUsername) || null;
};

export const AuthProvider = ({ children }) => {
  // B7: Rehidratar sesión desde sessionStorage al montar la app
  const [user, setUser] = useState(function () {
    const savedSession = sessionStorage.getItem('session_user');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Asegurar la presencia de los usuarios por defecto al montar la aplicación
  useEffect(() => {
    asegurarUsuariosPorDefecto();
  }, []);

  // B7: Persistir sesión en sessionStorage cuando cambia el usuario
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('session_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('session_user');
    }
  }, [user]);

  // Función para iniciar sesión (guardando el usuario en memoria)
  const login = (username, password) => {
    // 1. Obtener la lista asegurándonos de que contenga los usuarios básicos
    const users = asegurarUsuariosPorDefecto();

    // 2. Buscar el usuario ingresado
    const normalizedUsername = username.trim().toLowerCase();
    const foundUser = users.find(u => u.usuario.toLowerCase() === normalizedUsername);

    if (!foundUser) {
      return { success: false, error: "El usuario ingresado no existe." };
    }

    // 3. Validar contraseña — A3: campo unificado a "contrasena" (sin tilde)
    if (foundUser.contrasena !== password) {
      return { success: false, error: "La contraseña es incorrecta." };
    }

    // 4. Validar que el usuario esté activo
    if (foundUser.estado !== 'Activo') {
      return { success: false, error: "Tu usuario está inactivo. Contacta al administrador." };
    }

    // 5. Si todo está correcto, actualizamos el estado en memoria
    setUser(foundUser);
    return { success: true };
  };

  // Función para cerrar sesión (limpia el estado de memoria y sessionStorage)
  const logout = () => {
    setUser(null);
  };

  const syncUser = () => {
    setUser((currentUser) => {
      const updatedUser = obtenerUsuarioActualizado(currentUser);
      if (!updatedUser || updatedUser.estado !== 'Activo') {
        return null;
      }
      return updatedUser;
    });
  };

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
