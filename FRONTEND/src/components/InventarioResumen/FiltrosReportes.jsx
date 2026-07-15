import { Filter, RotateCcw, Search } from 'lucide-react';

function FiltrosReportes({ filtros, productos, loading, onChange, onBuscar, onLimpiar }) {
  function manejarCambio(event) {
    onChange({ ...filtros, [event.target.name]: event.target.value });
  }

  return (
    <form onSubmit={onBuscar} className="border-y border-slate-200 bg-slate-50 px-5 py-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Filter className="h-4 w-4" />
        Filtros
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="text-xs font-semibold text-slate-500">
          Desde
          <input type="date" name="desde" value={filtros.desde} onChange={manejarCambio} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500" />
        </label>

        <label className="text-xs font-semibold text-slate-500">
          Hasta
          <input type="date" name="hasta" value={filtros.hasta} onChange={manejarCambio} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500" />
        </label>

        <label className="text-xs font-semibold text-slate-500">
          Producto
          <select name="productoId" value={filtros.productoId} onChange={manejarCambio} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500">
            <option value="">Todos</option>
            {productos.map(function (producto) {
              return <option key={producto.id} value={producto.id}>{producto.nombre}</option>;
            })}
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-500">
          Tipo
          <select name="tipo" value={filtros.tipo} onChange={manejarCambio} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500">
            <option value="todos">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="salida">Salidas</option>
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer">
            <Search className="h-4 w-4" />
            Buscar
          </button>
          <button type="button" onClick={onLimpiar} disabled={loading} title="Limpiar filtros" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-60 cursor-pointer">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
}

export default FiltrosReportes;
