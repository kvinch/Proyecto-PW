import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const defaultUsers = [
  { id: 1, nombre: "Juan Pérez", usuario: "jperez", rol: "Administrador", estado: "Activo", contrasena: "123456" },
  { id: 2, nombre: "Ana Torres", usuario: "atorres", rol: "Supervisor", estado: "Activo", contrasena: "123456" },
  { id: 3, nombre: "Luis Ramos", usuario: "lramos", rol: "Operario", estado: "Inactivo", contrasena: "123456" }
];

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
    defaultUsers.forEach((defUser) => {
      const existe = users.some(u => u.usuario.toLowerCase() === defUser.usuario.toLowerCase());
      if (!existe) {
        users.push(defUser);
        modificado = true;
      }
    });
  }

  if (modificado) {
    localStorage.setItem('usuarios_app', JSON.stringify(users));
  }

  return users;
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
