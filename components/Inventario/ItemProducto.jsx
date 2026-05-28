import React from 'react';
import { Trash2, Edit2, Package } from 'lucide-react';

function ItemProducto(producto) {

  // Extrae el color del badge de categoría con un switch
  function getCategoriaBadge(categoria) {
    switch (categoria) {
      case 'Redes':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Equipos':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Materiales':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Herramientas':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  }

  // RF-13: determina el nivel de stock
  const esCritico = producto.stock <= producto.stockMinimo;
  const enRiesgo = !esCritico && producto.stock <= producto.stockMinimo * 1.5;

  // Calcula el porcentaje de la barra (el tope es 2x el stock mínimo = barra llena)
  const max = producto.stockMinimo > 0 ? producto.stockMinimo * 2 : 10;
  const porcentaje = Math.min(Math.round((producto.stock / max) * 100), 100);

  // Color de la barra según nivel de stock
  function getBarColor() {
    if (esCritico) return 'bg-rose-500';
    if (enRiesgo)  return 'bg-amber-400';
    return 'bg-emerald-500';
  }

  // Etiqueta y color de texto según nivel de stock
  function getEtiqueta() {
    if (esCritico) return { texto: 'CRÍTICO',   color: 'text-rose-600' };
    if (enRiesgo)  return { texto: 'EN RIESGO', color: 'text-amber-600' };
    return             { texto: 'NORMAL',     color: 'text-emerald-600' };
  }

  const etiqueta = getEtiqueta();

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">

      {/* Número de índice */}
      <td className="px-6 py-4 font-medium text-slate-400">
        {producto.num}
      </td>

      {/* Nombre del producto con ícono */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">{producto.nombre}</div>
          </div>
        </div>
      </td>

      {/* Categoría con badge de color */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoriaBadge(producto.categoria)}`}>
          {producto.categoria}
        </span>
      </td>

      {/* Unidad */}
      <td className="px-6 py-4 text-slate-600 capitalize">
        {producto.unidad}
      </td>

      {/* RF-13: Barra visual de stock (reemplaza Stock Actual + Stock Mínimo + Estado) */}
      <td className="px-6 py-4">
        <div className="min-w-[140px]">
          {/* Fila: barra de progreso + número actual */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-800 shrink-0 tabular-nums">
              {producto.stock}
            </span>
          </div>
          {/* Fila: stock mínimo · etiqueta de estado */}
          <p className="text-xs text-slate-400">
            min: <span className="font-medium text-slate-500">{producto.stockMinimo}</span>
            {' · '}
            <span className={`font-semibold ${etiqueta.color}`}>{etiqueta.texto}</span>
          </p>
        </div>
      </td>

      {/* Acciones: Editar y Eliminar */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {/* Botón de Editar */}
          <button
            onClick={producto.onEdit}
            title="Editar producto"
            className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Botón de Eliminar */}
          <button
            onClick={producto.onDelete}
            title="Eliminar producto"
            className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ItemProducto;
