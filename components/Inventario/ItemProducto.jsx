import { Trash2, Edit2, Package } from 'lucide-react';
import { esCritico, isStockEnRiesgo } from '../../src/utils/inventario';

// B3: Props desestructuradas para claridad semántica
function ItemProducto({ num, nombre, categoria, stock, stockMinimo, unidad, onEdit, onDelete }) {

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

  // M2: Usa funciones centralizadas de src/utils/inventario.js
  const productoData = { stock, stockMinimo };
  const critico = esCritico(productoData);
  const enRiesgo = isStockEnRiesgo(productoData);

  // Calcula el porcentaje de la barra (el tope es 2x el stock mínimo = barra llena)
  const max = stockMinimo > 0 ? stockMinimo * 2 : 10;
  const porcentaje = Math.min(Math.round((stock / max) * 100), 100);

  function getBarColor() {
    if (critico) return 'bg-rose-500';
    if (enRiesgo)  return 'bg-amber-400';
    return 'bg-emerald-500';
  }

  function getEtiqueta() {
    if (critico) return { texto: 'CRÍTICO',   color: 'text-rose-600' };
    if (enRiesgo)  return { texto: 'EN RIESGO', color: 'text-amber-600' };
    return             { texto: 'NORMAL',     color: 'text-emerald-600' };
  }

  const etiqueta = getEtiqueta();

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">

      {/* Número de índice */}
      <td className="px-6 py-4 font-medium text-slate-400">
        {num}
      </td>

      {/* Nombre del producto con ícono */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">{nombre}</div>
          </div>
        </div>
      </td>

      {/* Categoría con badge de color */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoriaBadge(categoria)}`}>
          {categoria}
        </span>
      </td>

      {/* Unidad */}
      <td className="px-6 py-4 text-slate-600 capitalize">
        {unidad}
      </td>

      {/* RF-13: Barra visual de stock */}
      <td className="px-6 py-4">
        <div className="min-w-[140px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-800 shrink-0 tabular-nums">
              {stock}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            min: <span className="font-medium text-slate-500">{stockMinimo}</span>
            {' · '}
            <span className={`font-semibold ${etiqueta.color}`}>{etiqueta.texto}</span>
          </p>
        </div>
      </td>

      {/* Acciones: Editar y Eliminar */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onEdit}
            title="Editar producto"
            className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
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
