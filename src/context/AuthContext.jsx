import React, { createContext, useContext, useState, useEffect } from 'react';

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

const defaultUsers = [
  { id: 1, nombre: "Juan Pérez", usuario: "jperez", rol: "Administrador", estado: "Activo", contrasena: "123456" },
  { id: 2, nombre: "Ana Torres", usuario: "atorres", rol: "Supervisor", estado: "Activo", contrasena: "123456" },
  { id: 3, nombre: "Luis Ramos", usuario: "lramos", rol: "Operario", estado: "Activo", contrasena: "123456" }
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
    users = [...defaultUsers];
    modificado = true;
  } else {
    // Si la lista existe, nos aseguramos de que los 3 usuarios por defecto estén registrados
    // y sincronizados con sus datos base.
    defaultUsers.forEach((defUser) => {
      const existingIndex = users.findIndex(
        (u) => u.usuario.toLowerCase() === defUser.usuario.toLowerCase()
      );

      if (existingIndex === -1) {
        users.push(defUser);
        modificado = true;
        return;
      }

      const currentUser = users[existingIndex];
      const mergedUser = {
        ...currentUser,
        id: defUser.id,
        nombre: defUser.nombre,
        usuario: defUser.usuario,
        rol: defUser.rol,
        estado: defUser.estado,
        contrasena: defUser.contrasena,
        contraseña: defUser.contrasena
      };

      if (JSON.stringify(currentUser) !== JSON.stringify(mergedUser)) {
        users[existingIndex] = mergedUser;
        modificado = true;
      }
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Asegurar la presencia de los usuarios por defecto al montar la aplicación
  useEffect(() => {
    asegurarUsuariosPorDefecto();
  }, []);

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

    // 3. Validar contraseña
    const correctPassword = foundUser.contraseña || foundUser.contrasena;
    if (correctPassword !== password) {
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

  // Función para cerrar sesión (limpia el estado de memoria)
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
