import { useMemo, useState } from "react";
import { ArrowUpCircle, Plus, Search, AlertTriangle } from "lucide-react";
import { contarCriticos } from "../../utils/inventario";
import { useAlert } from "../../context/AlertContext";
import { useInventario } from "../../context/InventarioContext";

const motivosSugeridos = ["Mantenimiento", "Obra", "Merma", "Prestamo"];

function formatearFecha(fecha) {
  if (!fecha) {
    return "";
  }

  return String(fecha).slice(0, 10);
}

function obtenerNombreProducto(salida) {
  return salida.producto?.nombre || "";
}

function Salidas() {
  const { showAlert } = useAlert();
  const { productos, salidas, saving, addSalida } = useInventario();

  const [formData, setFormData] = useState({
    productoId: "",
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
    producto: "Todos",
    busqueda: ""
  });

  const productoSeleccionado = useMemo(function () {
    return productos.find(function (producto) {
      return String(producto.id) === String(formData.productoId);
    });
  }, [productos, formData.productoId]);

  const totalCantidadSalidas = useMemo(function () {
    return salidas.reduce(function (acc, salida) {
      return acc + Number(salida.cantidad || 0);
    }, 0);
  }, [salidas]);

  const stockCritico = useMemo(function () {
    return contarCriticos(productos);
  }, [productos]);

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

  async function registrarSalida(e) {
    e.preventDefault();

    if (
      formData.productoId === "" ||
      formData.cantidad === "" ||
      formData.motivo === "" ||
      formData.responsable === "" ||
      formData.fecha === ""
    ) {
      showAlert("Completa todos los campos obligatorios.", "warning");
      return;
    }

    const cantidadSolicitada = Number(formData.cantidad);

    if (Number.isNaN(cantidadSolicitada) || cantidadSolicitada <= 0) {
      showAlert("La cantidad debe ser un numero mayor a 0.", "error");
      return;
    }

    if (!productoSeleccionado) {
      showAlert("Selecciona un producto valido.", "error");
      return;
    }

    if (cantidadSolicitada > Number(productoSeleccionado.stock)) {
      showAlert("Stock insuficiente para realizar la salida.", "error");
      return;
    }

    try {
      const data = await addSalida({
        productoId: Number(formData.productoId),
        cantidad: cantidadSolicitada,
        motivo: formData.motivo,
        responsable: formData.responsable,
        fecha: formData.fecha,
        observacion: formData.observacion
      });

      if (data.error) {
        showAlert(data.error, "error");
        return;
      }

      setFormData({
        productoId: "",
        cantidad: "",
        motivo: "",
        responsable: "",
        fecha: "",
        observacion: ""
      });

      showAlert("Salida registrada correctamente.", "success");
    } catch (error) {
      showAlert(error.message || "Error al registrar la salida.", "error");
    }
  }

  const salidasFiltradas = useMemo(function () {
    return salidas.filter(function (salida) {
      const nombreProducto = obtenerNombreProducto(salida);
      const fechaSalida = formatearFecha(salida.fecha);

      const cumpleBusqueda = nombreProducto
        .toLowerCase()
        .includes(filtros.busqueda.toLowerCase());

      const cumpleMotivo = filtros.motivo === "Todos" || salida.motivo === filtros.motivo;
      const cumpleProducto = filtros.producto === "Todos" || nombreProducto === filtros.producto;
      const cumpleFechaInicio = filtros.fechaInicio === "" || fechaSalida >= filtros.fechaInicio;
      const cumpleFechaFin = filtros.fechaFin === "" || fechaSalida <= filtros.fechaFin;

      return (
        cumpleBusqueda &&
        cumpleMotivo &&
        cumpleProducto &&
        cumpleFechaInicio &&
        cumpleFechaFin
      );
    });
  }, [salidas, filtros]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border-b border-slate-200/60">
          <ArrowUpCircle className="w-5 h-5 text-rose-600" />
          <h1 className="font-bold text-xl text-slate-800">Registro de Salidas</h1>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200/60 bg-slate-50/50">
          <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Movimientos</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{salidas.length}</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Unidades Despachadas</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{totalCantidadSalidas}</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Stock Critico</p>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-800">{stockCritico}</p>
          </article>
        </div>

        <form onSubmit={registrarSalida} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Producto</label>
            <select
              name="productoId"
              value={formData.productoId}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            >
              <option value="">Seleccionar producto</option>
              {productos.map(function (producto) {
                return (
                  <option key={producto.id} value={producto.id}>
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Motivo</label>
            <select
              name="motivo"
              value={formData.motivo}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Observacion</label>
            <input
              type="text"
              name="observacion"
              value={formData.observacion}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-semibold shadow-md hover:shadow-rose-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {saving ? "Registrando..." : "Registrar Salida"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/70 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Historial de Salidas</h2>
        </div>

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 border-b border-slate-200/70">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="busqueda"
              placeholder="Buscar producto..."
              value={filtros.busqueda}
              onChange={handleFiltroChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
          </div>

          <select
            name="motivo"
            value={filtros.motivo}
            onChange={handleFiltroChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
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

          <input
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleFiltroChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            title="Fecha desde"
          />

          <input
            type="date"
            name="fechaFin"
            value={filtros.fechaFin}
            onChange={handleFiltroChange}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
            title="Fecha hasta"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider text-xs font-semibold border-b border-slate-200/70">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Cantidad</th>
                <th className="px-6 py-3 text-left">Motivo</th>
                <th className="px-6 py-3 text-left">Responsable</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Observacion</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {salidasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                    No hay salidas que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                salidasFiltradas.map(function (salida) {
                  return (
                    <tr key={salida.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{obtenerNombreProducto(salida)}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 font-semibold">
                          -{salida.cantidad}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{salida.motivo}</td>
                      <td className="px-6 py-3.5 text-slate-600">{salida.responsable}</td>
                      <td className="px-6 py-3.5 text-slate-500">{formatearFecha(salida.fecha)}</td>
                      <td className="px-6 py-3.5 text-slate-500">{salida.observacion || "-"}</td>
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
