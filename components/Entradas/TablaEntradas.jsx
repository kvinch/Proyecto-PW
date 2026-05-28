
import React, { useState } from "react";

function TablaEntradas(props) {

  const entradas = props.entradas;

  const [busqueda, setBusqueda] = useState("");

  const [filtroResponsable, setFiltroResponsable] =
    useState("Todos");

  // Filtrado
  const entradasFiltradas = entradas.filter(function(entrada) {

    const coincideBusqueda =
      entrada.producto
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideResponsable =
      filtroResponsable === "Todos" ||
      entrada.responsable === filtroResponsable;

    return (
      coincideBusqueda &&
      coincideResponsable
    );

  });

  return (

    <div className="px-6 pb-6">

      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Historial de Entradas
      </h2>

      {/* Filtros */}

      <div className="flex flex-col md:flex-row gap-4 mb-4">

        {/* Buscador */}

        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={function(e) {
            setBusqueda(e.target.value);
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm w-full md:w-72"
        />

        {/* Filtro Responsable */}

        <select
          value={filtroResponsable}
          onChange={function(e) {
            setFiltroResponsable(e.target.value);
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm w-full md:w-60"
        >

          <option value="Todos">
            Todos los responsables
          </option>

          {[...new Set(
            entradas.map(function(entrada) {
              return entrada.responsable;
            })
          )].map(function(nombre, index) {

            return (
              <option
                key={index}
                value={nombre}
              >
                {nombre}
              </option>
            );

          })}

        </select>

      </div>

      {/* Tabla */}

      <div className="overflow-x-auto border border-slate-200 rounded-xl">

        <table className="w-full text-sm">

          <thead className="bg-slate-100 text-slate-600">

            <tr>

              <th className="px-4 py-3 text-left">
                Producto
              </th>

              <th className="px-4 py-3 text-left">
                Cantidad
              </th>

              <th className="px-4 py-3 text-left">
                Responsable
              </th>

              <th className="px-4 py-3 text-left">
                Fecha
              </th>

            </tr>

          </thead>

          <tbody>

            {entradasFiltradas.map(function(entrada) {

              return (

                <tr
                  key={entrada.id}
                  className="border-t border-slate-100"
                >

                  <td className="px-4 py-3">
                    {entrada.producto}
                  </td>

                  <td className="px-4 py-3">
                    {entrada.cantidad}
                  </td>

                  <td className="px-4 py-3">
                    {entrada.responsable}
                  </td>

                  <td className="px-4 py-3">
                    {entrada.fecha}
                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default TablaEntradas;

