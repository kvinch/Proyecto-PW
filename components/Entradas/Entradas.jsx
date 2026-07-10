import { useMemo, useState } from "react";
import { Plus, ArrowDownCircle, Boxes, AlertTriangle } from "lucide-react";
import TablaEntradas from "./TablaEntradas";
import { useInventario } from "../../src/context/InventarioContext";
import { useAlert } from "../../src/context/AlertContext";
import { contarCriticos } from "../../src/utils/inventario";

function Entradas() {
  const { showAlert } = useAlert();
  // A1: Usa context compartido en lugar de localStorage aislado
  const { productos, entradas, actualizarProductos, actualizarEntradas } = useInventario();

  const [formData, setFormData] = useState({
    producto: "",
    cantidad: "",
    proveedor: "",
    responsable: "",
    fecha: "",
    observacion: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.currentTarget.value
    });
  }

  function registrarEntrada(e) {
    e.preventDefault();

    if (
      formData.producto === "" ||
      formData.cantidad === "" ||
      formData.proveedor === "" ||
      formData.responsable === "" ||
      formData.fecha === ""
    ) {
      showAlert("Completa todos los campos.", "warning");
      return;
    }

    const nuevaEntrada = {
      id: crypto.randomUUID(),
      ...formData,
      cantidad: Number(formData.cantidad)
    };

    const listaEntradas = [...entradas, nuevaEntrada];

    const inventarioActualizado = productos.map(function (producto) {
      if (producto.nombre === formData.producto) {
        return {
          ...producto,
          stock: Number(producto.stock) + Number(formData.cantidad)
        };
      }
      return producto;
    });

    // A1: Actualiza a través del context para que otros módulos se sincronicen
    actualizarProductos(inventarioActualizado);
    actualizarEntradas(listaEntradas);

    showAlert("Entrada registrada correctamente.", "success");

    setFormData({
      producto: "",
      cantidad: "",
      proveedor: "",
      responsable: "",
      fecha: "",
      observacion: ""
    });
  }

  const totalCantidadEntradas = useMemo(function () {
    return entradas.reduce(function (acc, entrada) {
      return acc + Number(entrada.cantidad || 0);
    }, 0);
  }, [entradas]);

  // M2: Usa función centralizada de stock crítico
  const totalCriticos = useMemo(function () {
    return contarCriticos(productos);
  }, [productos]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border-b border-slate-200/60">
          <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
          <h1 className="font-bold text-xl text-slate-800">Registro de Entradas</h1>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200/60 bg-slate-50/50">
          <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Movimientos</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{entradas.length}</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Unidades Ingresadas</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{totalCantidadEntradas}</p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Stock Crítico</p>
              {totalCriticos > 0 ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <Boxes className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-800">{totalCriticos}</p>
          </article>
        </div>

        <form onSubmit={registrarEntrada} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Producto</label>
            <select
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
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
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Proveedor</label>
            <input
              type="text"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Responsable</label>
            <input
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Observación</label>
            <input
              type="text"
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Registrar Entrada
            </button>
          </div>
        </form>
      </div>

      <TablaEntradas entradas={entradas} />
    </div>
  );
}

export default Entradas;
