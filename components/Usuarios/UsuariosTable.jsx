import React from 'react';
import { Edit2, Trash2, User, CheckCircle2, XCircle } from 'lucide-react';

export default function UsuariosTable({ usuarios, onEdit, onDelete, onToggleStatus }) {
  
  // Función para sacar los colores a los roles
  const getRolBadge = (rol) => {
    switch (rol) {
      case 'Administrador':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Supervisor':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Operario':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  // Función para detectar el estado del usuario
  const getEstadoBadge = (estado) => {
    return estado === 'Activo'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-rose-50 text-rose-700 border-rose-100';
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {usuarios.length > 0 ? (
              usuarios.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors group">

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold border border-slate-200">
                        {usr.nombre.charAt(0).toUpperCase()}
                      </div>


                      <div>
                        <div className="font-semibold text-slate-800">{usr.nombre}</div>
                        <div className="text-xs text-slate-400">@{usr.usuario}</div>
                      </div>
                    </div>
                  </td>
                  
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRolBadge(usr.rol)}`}>
                      {usr.rol}
                    </span>
                  </td>
                  
                  {/* Estado (Permite cambiar estado haciendo click en el badge) */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus(usr.id)}
                      title="Haz click para cambiar el estado"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer hover:scale-105 active:scale-95 transition-all ${getEstadoBadge(usr.estado)}`}
                    >
                      {usr.estado === 'Activo' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Inactivo</span>
                        </>
                      )}
                    </button>
                  </td>
                  
                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(usr)}
                        title="Editar usuario"
                        className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(usr.id)}
                        title="Eliminar usuario"
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-12 px-6">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <User className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                    <span className="font-semibold text-sm">No se encontraron usuarios</span>
                    <span className="text-xs text-slate-400">Intenta cambiar el término de búsqueda o agrega uno nuevo.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
