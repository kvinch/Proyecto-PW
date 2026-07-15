import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(fecha));
}

function TablaMovimientos({ movimientos, loading }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <th className="px-5 py-3">Fecha</th>
            <th className="px-5 py-3">Tipo</th>
            <th className="px-5 py-3">Producto</th>
            <th className="px-5 py-3">Cantidad</th>
            <th className="px-5 py-3">Detalle</th>
            <th className="px-5 py-3">Responsable</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {loading ? (
            <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-400">Cargando reporte...</td></tr>
          ) : movimientos.length > 0 ? movimientos.map(function (movimiento) {
            const esEntrada = movimiento.tipo === 'Entrada';
            return (
              <tr key={`${movimiento.tipo}-${movimiento.id}`} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">{formatearFecha(movimiento.fecha)}</td>
                <td className="px-5 py-3">
                  <span className={esEntrada
                    ? 'inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700'
                    : 'inline-flex items-center gap-1.5 rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700'}>
                    {esEntrada ? <ArrowDownCircle className="h-3.5 w-3.5" /> : <ArrowUpCircle className="h-3.5 w-3.5" />}
                    {movimiento.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-slate-800">{movimiento.producto?.nombre || 'Producto no disponible'}</td>
                <td className="px-5 py-3 text-slate-700">{movimiento.cantidad} {movimiento.producto?.unidad || ''}</td>
                <td className="px-5 py-3 text-slate-500">{movimiento.detalle || '-'}</td>
                <td className="px-5 py-3 text-slate-500">{movimiento.responsable}</td>
              </tr>
            );
          }) : (
            <tr><td colSpan="6" className="px-5 py-12 text-center text-slate-400">No hay movimientos para los filtros seleccionados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaMovimientos;
