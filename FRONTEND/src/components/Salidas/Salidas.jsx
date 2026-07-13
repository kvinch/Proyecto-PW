import { useMemo, useState } from "react";
import { ArrowUpCircle, Plus, Search, AlertTriangle } from "lucide-react";
import { useInventario } from "../../context/InventarioContext";
import { contarCriticos } from "../../utils/inventario";
import { useAlert } from "../../context/AlertContext";

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
  const { showAlert } = useAlert();
  // A1: Usa context compartido
  const { productos, salidas, actualizarProductos, actualizarSalidas } = useInventario();

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
    producto: "Todos",
    busqueda: ""
  });

  // Inicializar salidas mock si no hay datos
  useState(function () {
    const salidasGuardadas = localStorage.getItem("salidas_app");
    if (salidasGuardadas == null && salidas.length === 0) {
      actualizarSalidas(salidasMock);
    }
  });

  const productoSeleccionado = useMemo(function () {
    return productos.find(function (producto) {
      return producto.nombre === formData.producto;
    });
  }, [productos, formData.producto]);

  const totalCantidadSalidas = useMemo(function () {
    return salidas.reduce(function (acc, salida) {
      return acc + Number(salida.cantidad || 0);
    }, 0);
  }, [salidas]);

  // M2: Usa función centralizada de stock crítico
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

  function registrarSalida(e) {
    e.preventDefault();

    if (
      formData.producto === "" ||
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
      showAlert("La cantidad debe ser un número mayor a 0.", "error");
      return;
    }

    if (!productoSeleccionado) {
      showAlert("Selecciona un producto válido.", "error");
      return;
    }

    if (cantidadSolicitada > Number(productoSeleccionado.stock)) {
      showAlert("Stock insuficiente para realizar la salida.", "error");
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
      id: crypto.randomUUID(),
      producto: formData.producto,
      cantidad: cantidadSolicitada,
      motivo: formData.motivo,
      responsable: formData.responsable,
      fecha: formData.fecha,
      observacion: formData.observacion
    };

    const historialActualizado = [...salidas, nuevaSalida];

    // A1: Actualiza a través del context para sincronización entre módulos
    actualizarProductos(inventarioActualizado);
    actualizarSalidas(historialActualizado);

    setFormData({
      producto: "",
      cantidad: "",
      motivo: "",
      responsable: "",
      fecha: "",
      observacion: ""
    });

    showAlert("Salida registrada correctamente.", "success");
  }

  const salidasFiltradas = useMemo(function () {
    return salidas.filter(function (salida) {
      const cumpleBusqueda = salida.producto
        .toLowerCase()
        .includes(filtros.busqueda.toLowerCase());

      const cumpleMotivo = filtros.motivo === "Todos" || salida.motivo === filtros.motivo;

      const cumpleProducto = filtros.producto === "Todos" || salida.producto === filtros.producto;

      const cumpleFechaInicio = filtros.fechaInicio === "" || salida.fecha >= filtros.fechaInicio;

      const cumpleFechaFin = filtros.fechaFin === "" || salida.fecha <= filtros.fechaFin;

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
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Stock Crítico</p>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-800">{stockCritico}</p>
          </article>
        </div>

        <form onSubmit={registrarSalida} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Producto</label>
            <select
              name="producto"
              value={formData.producto}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-rose-500 focus:bg-white transition-all"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Observación</label>
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-semibold shadow-md hover:shadow-rose-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Registrar Salida
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
                <th className="px-6 py-3 text-left">Observación</th>
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
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{salida.producto}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 font-semibold">
                          -{salida.cantidad}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{salida.motivo}</td>
                      <td className="px-6 py-3.5 text-slate-600">{salida.responsable}</td>
                      <td className="px-6 py-3.5 text-slate-500">{salida.fecha}</td>
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
