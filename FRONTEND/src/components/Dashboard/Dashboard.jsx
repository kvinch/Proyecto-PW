import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, ArrowDownCircle, ArrowUpCircle, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { useInventario } from '../../context/InventarioContext';
import { esCritico } from '../../utils/inventario';

function Dashboard() {
  const navigate = useNavigate();
  // A1: Usa context compartido — los datos se actualizan automáticamente al cambiar desde otro módulo
  const { productos, entradas, salidas } = useInventario();

  const totalStock = useMemo(function () {
    return productos.reduce(function (acc, producto) {
      return acc + Number(producto.stock || 0);
    }, 0);
  }, [productos]);

  // M2: Usa función centralizada de stock crítico
  const productosCriticos = useMemo(function () {
    return productos.filter(esCritico);
  }, [productos]);

  const movimientosRecientes = useMemo(function () {
    const entradasNormalizadas = entradas.map(function (entrada) {
      return {
        ...entrada,
        tipo: 'Entrada'
      };
    });

    const salidasNormalizadas = salidas.map(function (salida) {
      return {
        ...salida,
        tipo: 'Salida'
      };
    });

    return [...entradasNormalizadas, ...salidasNormalizadas]
      .sort(function (a, b) {
        const fechaA = new Date(a.fecha || 0).getTime();
        const fechaB = new Date(b.fecha || 0).getTime();

        if (fechaA === fechaB) {
          return Number(b.id || 0) - Number(a.id || 0);
        }

        return fechaB - fechaA;
      })
      .slice(0, 8);
  }, [entradas, salidas]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8">
        <div className="absolute top-0 right-0 h-48 w-48 translate-x-12 -translate-y-12 rounded-full bg-blue-100/70 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Resumen Operativo</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Dashboard de Inventario</h1>
            <p className="mt-3 text-slate-500 max-w-2xl">Monitorea stock actual, movimientos de entradas y salidas, y productos en estado crítico.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={function () { navigate('/Entradas'); }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md cursor-pointer"
            >
              Registrar Entrada
            </button>
            <button
              type="button"
              onClick={function () { navigate('/Salidas'); }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md cursor-pointer"
            >
              Registrar Salida
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Productos</p>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{productos.length}</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Stock Total</p>
            <Boxes className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{totalStock}</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Entradas</p>
            <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{entradas.length}</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Salidas</p>
            <ArrowUpCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-800">{salidas.length}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <article className="xl:col-span-3 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50">
            <h2 className="text-base font-bold text-slate-800">Estado de Stock por Producto</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/60 border-b border-slate-200/70">
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Mínimo</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {productos.length > 0 ? (
                  productos.map(function (producto) {
                    const critico = esCritico(producto);
                    return (
                      <tr key={producto.id}>
                        <td className="px-6 py-3 font-medium text-slate-700">{producto.nombre}</td>
                        <td className="px-6 py-3 text-slate-500">{producto.categoria}</td>
                        <td className="px-6 py-3 text-slate-700">{producto.stock} {producto.unidad}</td>
                        <td className="px-6 py-3 text-slate-500">{producto.stockMinimo}</td>
                        <td className="px-6 py-3">
                          <span className={critico
                            ? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700'
                            : 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700'}>
                            {critico ? 'Crítico' : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">No hay productos disponibles en inventario.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="xl:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Movimientos Recientes</h2>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
            {movimientosRecientes.length > 0 ? (
              movimientosRecientes.map(function (movimiento) {
                const esEntrada = movimiento.tipo === 'Entrada';
                return (
                  <div
                    key={movimiento.tipo + '-' + movimiento.id}
                    className="rounded-xl border border-slate-200/80 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{movimiento.producto}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{movimiento.fecha || 'Sin fecha'}</p>
                      </div>
                      <span className={esEntrada
                        ? 'text-xs font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-700'
                        : 'text-xs font-bold px-2 py-1 rounded-md bg-rose-100 text-rose-700'}>
                        {esEntrada ? 'Entrada' : 'Salida'}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2">
                      Cantidad: <span className="font-semibold">{movimiento.cantidad}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Responsable: {movimiento.responsable || 'No especificado'}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-400 py-10">
                No hay movimientos registrados.
              </div>
            )}
          </div>
        </article>
      </section>

      {productosCriticos.length > 0 && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 flex items-center gap-3 text-rose-700">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-sm font-medium">
            {productosCriticos.length} {productosCriticos.length === 1 ? 'producto tiene' : 'productos tienen'} stock crítico.
          </p>
          <button
            type="button"
            onClick={function () { navigate('/Inventarios'); }}
            className="ml-auto text-xs font-semibold underline underline-offset-2 hover:text-rose-900 cursor-pointer"
          >
            Revisar inventario
          </button>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
