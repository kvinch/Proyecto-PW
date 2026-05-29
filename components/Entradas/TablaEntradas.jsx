import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

function TablaEntradas(props) {
  const entradas = props.entradas;
  const [busqueda, setBusqueda] = useState("");
  const [filtroResponsable, setFiltroResponsable] = useState("Todos");

  const responsables = useMemo(function () {
    return [...new Set(entradas.map(function (entrada) {
      return entrada.responsable;
    }))];
  }, [entradas]);

  const entradasFiltradas = entradas.filter(function (entrada) {
    const coincideBusqueda = entrada.producto
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideResponsable =
      filtroResponsable === "Todos" || entrada.responsable === filtroResponsable;

    return coincideBusqueda && coincideResponsable;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200/70 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">Historial de Entradas</h2>
      </div>

      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-200/70">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={function (e) {
              setBusqueda(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <select
          value={filtroResponsable}
          onChange={function (e) {
            setFiltroResponsable(e.target.value);
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
        >
          <option value="Todos">Todos los responsables</option>
          {responsables.map(function (nombre, index) {
            return (
              <option key={index} value={nombre}>
                {nombre}
              </option>
            );
          })}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider text-xs font-semibold border-b border-slate-200/70">
            <tr>
              <th className="px-6 py-3 text-left">Producto</th>
              <th className="px-6 py-3 text-left">Cantidad</th>
              <th className="px-6 py-3 text-left">Responsable</th>
              <th className="px-6 py-3 text-left">Fecha</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {entradasFiltradas.length > 0 ? (
              entradasFiltradas.map(function (entrada) {
                return (
                  <tr key={entrada.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-slate-700 font-medium">{entrada.producto}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 font-semibold">
                        +{entrada.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{entrada.responsable}</td>
                    <td className="px-6 py-3.5 text-slate-500">{entrada.fecha}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                  No hay entradas que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaEntradas;
