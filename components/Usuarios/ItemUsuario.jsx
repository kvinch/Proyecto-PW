import { Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';

// B3: Props desestructuradas para claridad semántica
function ItemUsuario({ num, nombre, usuario, rol, estado, onToggle, onEdit, onDelete }) {

  function getRolBadge(rol) {
    switch (rol) {
      case 'Administrador':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Supervisor':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Operario':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  }

  function getEstadoBadge(estado) {
    return estado === 'Activo'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-rose-50 text-rose-700 border-rose-100';
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-4 font-medium text-slate-400">
        {num} 
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold border border-slate-200">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{nombre}</div>
            <div className="text-xs text-slate-400">@{usuario}</div>
          </div>
        </div>
      </td>
      
      {/* Rol */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRolBadge(rol)}`}>
          {rol}
        </span>
      </td>
      
      {/* Estado con toggle */}
      <td className="px-6 py-4">
        <button 
          type="button"
          onClick={onToggle} 
          title="Cambiar estado"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer hover:scale-105 active:scale-95 transition-all ${getEstadoBadge(estado)}`}
        >
          {estado === 'Activo' ? (
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
      
      {/* Acciones: Editar y Eliminar */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onEdit}
            title="Editar usuario"
            className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={onDelete}
            title="Eliminar usuario"
            className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ItemUsuario;
