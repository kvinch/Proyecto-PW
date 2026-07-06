// Fuente única de usuarios seed del sistema.
// Importar este array en AuthContext.jsx y Usuarios.jsx
// para evitar duplicación de datos mock.
const seedUsers = [
  { id: 1, nombre: "Juan Pérez", usuario: "jperez", rol: "Administrador", estado: "Activo", contrasena: "123456" },
  { id: 2, nombre: "Ana Torres", usuario: "atorres", rol: "Supervisor", estado: "Activo", contrasena: "123456" },
  { id: 3, nombre: "Luis Ramos", usuario: "lramos", rol: "Operario", estado: "Activo", contrasena: "123456" }
];

export default seedUsers;
