import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpCircle, Plus } from "lucide-react";

const salidasMock = [
  {
    id: 1,
    producto: "Cable UTP Cat 6",
    cantidad: 20,
    motivo: "Obra",
    responsable: "Luis Ramos",
    fecha: "2026-05-22",
    observacion: ""
  },
  {
    id: 2,
    producto: "Conectores RJ45",
    cantidad: 30,
    motivo: "Mantenimiento",
    responsable: "Ana Torres",
    fecha: "2026-05-23",
    observacion: ""
  }
];

const motivosSugeridos = ["Mantenimiento", "Obra", "Merma", "Préstamo"];

function Salidas() {
  const [productos, setProductos] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [formData, setFormData] = useState({
    producto: "",
    cantidad: "",
    motivo: "",
    responsable: "",
    fecha: "",
    observacion: ""
  });

  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    motivo: "Todos",
    producto: "Todos"
  });

  useEffect(function () {
    const inventarioGuardado = localStorage.getItem("inventario_app");
    if (inventarioGuardado != null) {
      setProductos(JSON.parse(inventarioGuardado));
    }

    const salidasGuardadas = localStorage.getItem("salidas_app");
    if (salidasGuardadas != null) {
      setSalidas(JSON.parse(salidasGuardadas));
      return;
    }

    localStorage.setItem("salidas_app", JSON.stringify(salidasMock));
    setSalidas(salidasMock);
  }, []);

  const productoSeleccionado = useMemo(function () {
    return productos.find(function (producto) {
      return producto.nombre === formData.producto;
    });
  }, [productos, formData.producto]);

  function handleFormChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.currentTarget.value
    });
  }

  function handleFiltroChange(e) {
    setFiltros({
      ...filtros,
      [e.target.name]: e.currentTarget.value
    });
  }

  function registrarSalida(e) {
    e.preventDefault();

    if (
      formData.producto === "" ||
      formData.cantidad === "" ||
      formData.motivo === "" ||
      formData.responsable === "" ||
      formData.fecha === ""
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const cantidadSolicitada = Number(formData.cantidad);

    if (Number.isNaN(cantidadSolicitada) || cantidadSolicitada <= 0) {
      alert("La cantidad debe ser un número mayor a 0.");
      return;
    }

    if (!productoSeleccionado) {
      alert("Selecciona un producto válido.");
      return;
    }

    if (cantidadSolicitada > Number(productoSeleccionado.stock)) {
      alert("Stock insuficiente para realizar la salida.");
      return;
    }

    const inventarioActualizado = productos.map(function (producto) {
      if (producto.nombre === formData.producto) {
        return {
          ...producto,
          stock: Number(producto.stock) - cantidadSolicitada
        };
      }
      return producto;
    });

    const nuevaSalida = {
      id: Date.now(),
      producto: formData.producto,
      cantidad: cantidadSolicitada,
      motivo: formData.motivo,
      responsable: formData.responsable,
      fecha: formData.fecha,
      observacion: formData.observacion
    };

    const historialActualizado = [...salidas, nuevaSalida];

    localStorage.setItem("inventario_app", JSON.stringify(inventarioActualizado));
    localStorage.setItem("salidas_app", JSON.stringify(historialActualizado));

    setProductos(inventarioActualizado);
    setSalidas(historialActualizado);
    setFormData({
      producto: "",
      cantidad: "",
      motivo: "",
      responsable: "",
      fecha: "",
      observacion: ""
    });

    alert("Salida registrada correctamente.");
  }

  const salidasFiltradas = useMemo(function () {
    return salidas.filter(function (salida) {
      const cumpleMotivo =
        filtros.motivo === "Todos" || salida.motivo === filtros.motivo;

      const cumpleProducto =
        filtros.producto === "Todos" || salida.producto === filtros.producto;

      const cumpleFechaInicio =
        filtros.fechaInicio === "" || salida.fecha >= filtros.fechaInicio;

      const cumpleFechaFin =
        filtros.fechaFin === "" || salida.fecha <= filtros.fechaFin;

      return (
        cumpleMotivo &&
        cumpleProducto &&
        cumpleFechaInicio &&
        cumpleFechaFin
      );
    });
  }, [salidas, filtros]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border-b border-slate-200/60">
        <ArrowUpCircle className="w-5 h-5 text-rose-600" />
        <h1 className="font-bold text-xl text-slate-800">Registro de Salidas</h1>
      </div>

      <form onSubmit={registrarSalida} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Producto</label>
          <select
            name="producto"
            value={formData.producto}
            onChange={handleFormChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          >
            <option value="">Seleccionar producto</option>
            {productos.map(function (producto) {
              return (
                <option key={producto.id} value={producto.nombre}>
                  {producto.nombre} (stock: {producto.stock})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Cantidad</label>
          <input
            type="number"
            min="1"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleFormChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Motivo</label>
          <select
            name="motivo"
            value={formData.motivo}
            onChange={handleFormChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          >
            <option value="">Seleccionar motivo</option>
            {motivosSugeridos.map(function (motivo) {
              return (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Responsable</label>
          <input
            type="text"
            name="responsable"
            value={formData.responsable}
            onChange={handleFormChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleFormChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Observación</label>
          <input
            type="text"
            name="observacion"
            value={formData.observacion}
            onChange={handleFormChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          >
            <Plus className="w-4 h-4" />
            Registrar Salida
          </button>
        </div>
      </form>

      <div className="px-6 pb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Historial de Salidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleFiltroChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            title="Fecha desde"
          />

          <input
            type="date"
            name="fechaFin"
            value={filtros.fechaFin}
            onChange={handleFiltroChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            title="Fecha hasta"
          />

          <select
            name="motivo"
            value={filtros.motivo}
            onChange={handleFiltroChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          >
            <option value="Todos">Todos los motivos</option>
            {motivosSugeridos.map(function (motivo) {
              return (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              );
            })}
          </select>

          <select
            name="producto"
            value={filtros.producto}
            onChange={handleFiltroChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          >
            <option value="Todos">Todos los materiales</option>
            {[...new Set(salidas.map(function (salida) { return salida.producto; }))].map(function (producto) {
              return (
                <option key={producto} value={producto}>
                  {producto}
                </option>
              );
            })}
          </select>

        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Cantidad</th>
                <th className="px-4 py-3 text-left">Motivo</th>
                <th className="px-4 py-3 text-left">Responsable</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Observación</th>
              </tr>
            </thead>

            <tbody>
              {salidasFiltradas.length === 0 ? (
                <tr className="border-t border-slate-100">
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                    No hay salidas que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                salidasFiltradas.map(function (salida) {
                  return (
                    <tr key={salida.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{salida.producto}</td>
                      <td className="px-4 py-3">{salida.cantidad}</td>
                      <td className="px-4 py-3">{salida.motivo}</td>
                      <td className="px-4 py-3">{salida.responsable}</td>
                      <td className="px-4 py-3">{salida.fecha}</td>
                      <td className="px-4 py-3">{salida.observacion || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Salidas;
