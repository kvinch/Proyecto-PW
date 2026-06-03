import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw, Users } from 'lucide-react';
import ItemUsuario from './ItemUsuario';

const usuariosMock = [
  {
    id: 1,
    nombre: "Juan Pérez",
    usuario: "jperez",
    rol: "Administrador",
    estado: "Activo",
    contraseña: "123456"
  },
  {
    id: 2,
    nombre: "Ana Torres",
    usuario: "atorres",
    rol: "Supervisor",
    estado: "Activo",
    contraseña: "123456"
  },
  {
    id: 3,
    nombre: "Luis Ramos",
    usuario: "lramos",
    rol: "Operario",
    estado: "Activo",
    contraseña: "123456"
  }
];

function Usuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setbusqueda] = useState('');
  const [rolFilter, setRolFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  // Carga inicial desde localStorage
  useEffect(function() {
    const saved = localStorage.getItem('usuarios_app');
    if (saved != null) {
      try {
        setUsuarios(JSON.parse(saved));
      } catch (e) {
        console.error("Error al parsear localStorage", e);
        setUsuarios(usuariosMock);
      }
    } else {
      setUsuarios(usuariosMock);
      localStorage.setItem('usuarios_app', JSON.stringify(usuariosMock));
    }
  }, []);

  // Función para guardar en localStorage y actualizar estado local
  function updateUsuariosList(newList) {
    setUsuarios(newList);
    localStorage.setItem('usuarios_app', JSON.stringify(newList));
  }

  // Cambiar estado de un usuario (Activo/Inactivo) al hacer click
  function handleToggleStatus(id) {
    const updated = usuarios.map(function(usr) {
      if (usr.id === id) {
        return {
          ...usr,
          estado: usr.estado === 'Activo' ? 'Inactivo' : 'Activo'
        };
      }
      return usr;
    });
    updateUsuariosList(updated);
  }

  // Eliminar un usuario de la lista
  function handleDeleteUsuario(id) {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const filtered = usuarios.filter(function(usr) {
        return usr.id !== id;
      });
      updateUsuariosList(filtered);
    }
  }

  // Limpiar todos los filtros aplicados
  function handleResetFilters() {
    setbusqueda('');
    setRolFilter('Todos');
    setEstadoFilter('Todos');
  }

  // Filtrado de usuarios
  const usuariosFiltrados = usuarios.filter(function(usr) {
    const matchesSearch = 
      usr.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usr.usuario.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchesRol = rolFilter === 'Todos' || usr.rol === rolFilter;
    const matchesEstado = estadoFilter === 'Todos' || usr.estado === estadoFilter;

    return matchesSearch && matchesRol && matchesEstado;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera premium y controles de filtro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Barra de búsqueda */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={busqueda}
            onChange={function(e) {
              setbusqueda(e.currentTarget.value);
            }}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Filtros y Acción */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Rol */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={rolFilter}
              onChange={function(e) {
                setRolFilter(e.currentTarget.value);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            >
              <option value="Todos">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Operario">Operario</option>
            </select>
          </div>

          {/* Selector de Estado */}
          <select
            value={estadoFilter}
            onChange={function(e) {
              setEstadoFilter(e.currentTarget.value);
            }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          {/* Limpiar filtros */}
          {(busqueda || rolFilter !== 'Todos' || estadoFilter !== 'Todos') && (
            <button
              onClick={handleResetFilters}
              title="Restablecer filtros"
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Botón de Agregar Usuario (Navega a la página de registro) */}
          <button
            onClick={function() {
              navigate("/usuarios/nuevo");
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Usuario</span>
          </button>
        </div>
      </div>

      {/* Tabla Premium */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {usuariosFiltrados.length > 0 ? (
                // Mapeo utilizando props en componentes hijos de manera idéntica al ejemplo del profesor
                usuariosFiltrados.map(function(usuario, index) {
                  return (
                    <ItemUsuario
                      key={"usuario" + index}
                      num={index + 1}
                      nombre={usuario.nombre}
                      usuario={usuario.usuario}
                      rol={usuario.rol}
                      estado={usuario.estado}
                      onToggle={function() {
                        handleToggleStatus(usuario.id);
                      }}
                      onEdit={function() {
                        navigate("/usuarios/editar/" + usuario.id);
                      }}
                      onDelete={function() {
                        handleDeleteUsuario(usuario.id);
                      }}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-12 px-6">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Users className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                      <span className="font-semibold text-sm">No se encontraron usuarios</span>
                      <span className="text-xs text-slate-400">Intenta cambiar el filtro o agrega un nuevo usuario.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;
