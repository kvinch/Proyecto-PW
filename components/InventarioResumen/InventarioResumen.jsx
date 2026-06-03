import { useEffect, useMemo, useState } from 'react';
import { Package, AlertTriangle, RefreshCw } from 'lucide-react';

function leerInventario() {
  const raw = localStorage.getItem('inventario_app');
  if (raw == null) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al leer inventario_app', error);
    return [];
  }
}

function InventarioResumen() {
  const [productos, setProductos] = useState([]);

  function recargar() {
    setProductos(leerInventario());
  }

  useEffect(function () {
    recargar();
  }, []);

  const totalStock = useMemo(function () {
    return productos.reduce(function (acc, producto) {
      return acc + Number(producto.stock || 0);
    }, 0);
  }, [productos]);

  const totalCriticos = useMemo(function () {
    return productos.filter(function (producto) {
      return Number(producto.stock || 0) <= Number(producto.stockMinimo || 0);
    }).length;
  }, [productos]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Vista General</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-800 tracking-tight">Inventario</h1>
            <p className="mt-2 text-slate-500">Consulta el stock actual de todos los productos registrados.</p>
          </div>

          <button
            type="button"
            onClick={recargar}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-slate-500">Productos Totales</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{productos.length}</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-slate-500">Stock Total</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{totalStock}</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <p className="text-sm font-semibold text-slate-500">Stock Crítico</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">{totalCriticos}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Unidad</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {productos.length > 0 ? (
                productos.map(function (producto, index) {
                  const esCritico = Number(producto.stock || 0) <= Number(producto.stockMinimo || 0);

                  return (
                    <tr key={producto.id || ('row-' + index)} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-medium">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                            <Package className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-800">{producto.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{producto.categoria}</td>
                      <td className="px-6 py-4 text-slate-600">{producto.unidad}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{producto.stock}</td>
                      <td className="px-6 py-4">
                        {esCritico ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Crítico
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No hay productos para mostrar en inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default InventarioResumen;
