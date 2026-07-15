import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowDownToLine,
  ArrowUpCircle,
  ArrowUpFromLine,
  Boxes,
  Package,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import useDashboardData from '../../hooks/useDashboardData';

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(fecha));
}

function Dashboard() {
  const navigate = useNavigate();
  const {
    totales,
    productos,
    productosCriticos,
    movimientosRecientes,
    loading,
    error,
    refrescar
  } = useDashboardData();

  return (
    <div className="space-y-6">
      <section className="border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Resumen operativo</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-800">Dashboard de Inventario</h1>
            <p className="mt-2 max-w-2xl text-slate-500">Stock actual, movimientos y alertas obtenidos directamente del backend.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={refrescar} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 cursor-pointer">
              <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              Actualizar
            </button>
            <button type="button" onClick={function () { navigate('/Entradas'); }} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 cursor-pointer">
              <ArrowDownToLine className="h-4 w-4" />
              Entrada
            </button>
            <button type="button" onClick={function () { navigate('/Salidas'); }} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 cursor-pointer">
              <ArrowUpFromLine className="h-4 w-4" />
              Salida
            </button>
          </div>
        </div>
      </section>

      {error && <section className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">{error}</section>}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-slate-500"><p className="text-sm font-semibold">Productos</p><Package className="h-5 w-5 text-blue-500" /></div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{totales.productos}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-slate-500"><p className="text-sm font-semibold">Stock total</p><Boxes className="h-5 w-5 text-indigo-500" /></div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{totales.stock}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-slate-500"><p className="text-sm font-semibold">Entradas</p><ArrowDownCircle className="h-5 w-5 text-emerald-600" /></div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{totales.entradas}</p>
          <p className="mt-1 text-xs text-slate-400">{totales.unidadesEntrada} unidades registradas</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between text-slate-500"><p className="text-sm font-semibold">Salidas</p><ArrowUpCircle className="h-5 w-5 text-rose-600" /></div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{totales.salidas}</p>
          <p className="mt-1 text-xs text-slate-400">{totales.unidadesSalida} unidades registradas</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white xl:col-span-3">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><h2 className="text-base font-bold text-slate-800">Estado de stock</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500"><th className="px-5 py-3">Producto</th><th className="px-5 py-3">Categoria</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Minimo</th><th className="px-5 py-3">Estado</th></tr></thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {productos.length > 0 ? productos.map(function (producto) {
                  const critico = Number(producto.stock) <= Number(producto.stockMinimo);
                  return (
                    <tr key={producto.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-700">{producto.nombre}</td>
                      <td className="px-5 py-3 text-slate-500">{producto.categoria}</td>
                      <td className="px-5 py-3 text-slate-700">{producto.stock} {producto.unidad}</td>
                      <td className="px-5 py-3 text-slate-500">{producto.stockMinimo}</td>
                      <td className="px-5 py-3"><span className={critico ? 'rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700' : 'rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700'}>{critico ? 'Critico' : 'Normal'}</span></td>
                    </tr>
                  );
                }) : <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-400">{loading ? 'Cargando productos...' : 'No hay productos disponibles.'}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4"><h2 className="text-base font-bold text-slate-800">Movimientos recientes</h2><TrendingUp className="h-4 w-4 text-slate-400" /></div>
          <div className="max-h-[430px] divide-y divide-slate-100 overflow-y-auto">
            {movimientosRecientes.length > 0 ? movimientosRecientes.map(function (movimiento) {
              const esEntrada = movimiento.tipo === 'Entrada';
              return (
                <div key={`${movimiento.tipo}-${movimiento.id}`} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-sm font-semibold text-slate-800">{movimiento.producto?.nombre || 'Producto no disponible'}</p><p className="mt-1 text-xs text-slate-500">{formatearFecha(movimiento.fecha)}</p></div>
                    <span className={esEntrada ? 'rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700' : 'rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700'}>{movimiento.tipo}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">Cantidad: <span className="font-semibold">{movimiento.cantidad}</span></p>
                  <p className="mt-1 text-xs text-slate-500">Responsable: {movimiento.responsable || 'No especificado'}</p>
                </div>
              );
            }) : <div className="py-10 text-center text-slate-400">{loading ? 'Cargando movimientos...' : 'No hay movimientos registrados.'}</div>}
          </div>
        </div>
      </section>

      {productosCriticos.length > 0 && (
        <section className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
          <p className="text-sm font-medium">{productosCriticos.length} {productosCriticos.length === 1 ? 'producto tiene' : 'productos tienen'} stock critico.</p>
          <button type="button" onClick={function () { navigate('/Inventarios'); }} className="ml-auto text-xs font-semibold underline cursor-pointer">Revisar inventario</button>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
