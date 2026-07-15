import { useState } from 'react';
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Boxes, RefreshCw } from 'lucide-react';
import { useInventario } from '../../context/InventarioContext';
import useReportesData from '../../hooks/useReportesData';
import FiltrosReportes from './FiltrosReportes';
import TablaMovimientos from './TablaMovimientos';

const filtrosIniciales = { desde: '', hasta: '', productoId: '', tipo: 'todos' };

function InventarioResumen() {
  const { productos } = useInventario();
  const { movimientos, resumen, productosCriticos, categorias, loading, error, buscar } = useReportesData();
  const [filtros, setFiltros] = useState(filtrosIniciales);

  function manejarBusqueda(event) {
    event.preventDefault();
    buscar(filtros);
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales);
    buscar(filtrosIniciales);
  }

  return (
    <div className="space-y-6">
      <section className="border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Analisis de inventario</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-800">Reportes</h1>
            <p className="mt-2 text-slate-500">Consulta movimientos, balances, categorias y productos con stock critico.</p>
          </div>
          <button type="button" onClick={function () { buscar(filtros); }} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 cursor-pointer">
            <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            Actualizar
          </button>
        </div>
      </section>

      {error && <section className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">{error}</section>}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Movimientos</p><Boxes className="h-5 w-5 text-blue-500" /></div><p className="mt-3 text-3xl font-bold text-slate-800">{resumen.movimientos}</p></article>
        <article className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Unidades ingresadas</p><ArrowDownCircle className="h-5 w-5 text-emerald-600" /></div><p className="mt-3 text-3xl font-bold text-emerald-700">{resumen.unidadesEntrada}</p></article>
        <article className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Unidades retiradas</p><ArrowUpCircle className="h-5 w-5 text-rose-600" /></div><p className="mt-3 text-3xl font-bold text-rose-700">{resumen.unidadesSalida}</p></article>
        <article className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Balance del periodo</p><AlertTriangle className="h-5 w-5 text-amber-500" /></div><p className="mt-3 text-3xl font-bold text-slate-800">{resumen.balance}</p></article>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <FiltrosReportes filtros={filtros} productos={productos} loading={loading} onChange={setFiltros} onBuscar={manejarBusqueda} onLimpiar={limpiarFiltros} />
        <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-slate-800">Historial de movimientos</h2></div>
        <TablaMovimientos movimientos={movimientos} loading={loading} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h2 className="font-bold text-slate-800">Resumen por categoria</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500"><th className="px-5 py-3">Categoria</th><th className="px-5 py-3">Productos</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Criticos</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{categorias.length > 0 ? categorias.map(function (categoria) { return <tr key={categoria.categoria}><td className="px-5 py-3 font-semibold text-slate-700">{categoria.categoria}</td><td className="px-5 py-3 text-slate-500">{categoria.productos}</td><td className="px-5 py-3 text-slate-500">{categoria.stock}</td><td className="px-5 py-3 text-rose-600">{categoria.criticos}</td></tr>; }) : <tr><td colSpan="4" className="px-5 py-10 text-center text-slate-400">No hay categorias disponibles.</td></tr>}</tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4"><AlertTriangle className="h-4 w-4 text-rose-500" /><h2 className="font-bold text-slate-800">Stock critico</h2></div>
          <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
            {productosCriticos.length > 0 ? productosCriticos.map(function (producto) {
              return <div key={producto.id} className="flex items-center justify-between gap-4 px-5 py-3"><div><p className="text-sm font-semibold text-slate-800">{producto.nombre}</p><p className="text-xs text-slate-500">{producto.categoria}</p></div><div className="text-right"><p className="text-sm font-bold text-rose-600">{producto.stock} {producto.unidad}</p><p className="text-xs text-slate-400">Minimo: {producto.stockMinimo}</p></div></div>;
            }) : <div className="px-5 py-10 text-center text-slate-400">No hay productos con stock critico.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default InventarioResumen;
