import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft, Save } from "lucide-react";
import { useAlert } from "../../context/AlertContext.jsx";
import { useInventario } from "../../context/InventarioContext.jsx";
import inventarioService from "../../services/inventarioService";

function RegistroProducto() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el ID de la URL si estamos editando
  const { showAlert } = useAlert();
  const { refrescar } = useInventario();

  // Declaración de estados locales del formulario
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Redes");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [unidad, setUnidad] = useState("unidad");
  const [loading, setLoading] = useState(false);

  // Si hay un ID en la URL, cargamos los datos del producto usando el service
  useEffect(function() {
    if (id != null) {
      const service = inventarioService();
      service.getProductoById(id)
        .then(function(producto) {
          if (producto.error) {
            throw new Error(producto.error);
          }
          setNombre(producto.nombre);
          setCategoria(producto.categoria);
          setStock(producto.stock);
          setStockMinimo(producto.stockMinimo);
          setUnidad(producto.unidad);
        })
        .catch(function(error) {
          showAlert(error.message, "error");
          navigate("/Inventarios");
        });
    }
  }, [id, navigate, showAlert]);

  // Función guardar con soporte para creación y edición (RF-10 y RF-11)
  async function guardarProducto() {
    // Validación de campos obligatorios
    if (nombre.trim() === "" || stock === "" || stockMinimo === "") {
      showAlert("Por favor, completa todos los campos.", "warning");
      return;
    }

    // Validamos que stock y stockMinimo sean números válidos y positivos
    const stockNum = Number(stock);
    const stockMinimoNum = Number(stockMinimo);

    if (isNaN(stockNum) || isNaN(stockMinimoNum) || stockNum < 0 || stockMinimoNum < 0) {
      showAlert("El stock y el stock mínimo deben ser números positivos.", "error");
      return;
    }

    try {
      setLoading(true);

      const body = {
        nombre: nombre.trim(),
        categoria: categoria,
        stock: stockNum,
        stockMinimo: stockMinimoNum,
        unidad: unidad
      };

      const service = inventarioService();
      let data;

      if (id != null) {
        // Modo edición (RF-11): PUT al backend
        data = await service.updateProducto(id, body);
      } else {
        // Modo creación (RF-10): POST al backend
        data = await service.addProducto(body);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Refrescar el contexto global para que otros módulos vean los cambios
      refrescar();

      // Redirige de vuelta al inventario
      navigate("/Inventarios");
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Cabecera dinámica según modo crear o editar */}
      <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border-b border-slate-200/60">
        <button
          type="button"
          onClick={function() { navigate("/Inventarios"); }}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <h1 className="font-bold text-xl text-slate-800">
            {id != null ? "Editar Producto" : "Registrar Nuevo Producto"}
          </h1>
        </div>
      </div>

      {/* M3: onSubmit en el form para que Enter dispare el guardado */}
      <form className="p-6 space-y-5" onSubmit={function(e) { e.preventDefault(); guardarProducto(); }}>
        {/* Nombre del producto */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Nombre del Producto
          </label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            type="text"
            placeholder="Ej. Cable UTP Cat 6"
            value={nombre}
            onChange={function(e) {
              setNombre(e.currentTarget.value);
            }}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Categoría
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            value={categoria}
            onChange={function(e) {
              setCategoria(e.currentTarget.value);
            }}
          >
            <option value="Redes">Redes</option>
            <option value="Equipos">Equipos</option>
            <option value="Materiales">Materiales</option>
            <option value="Herramientas">Herramientas</option>
          </select>
        </div>

        {/* Stock actual y Stock mínimo en fila */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Stock Actual
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
              type="number"
              min="0"
              placeholder="Ej. 100"
              value={stock}
              onChange={function(e) {
                setStock(e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Stock Mínimo
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
              type="number"
              min="0"
              placeholder="Ej. 10"
              value={stockMinimo}
              onChange={function(e) {
                setStockMinimo(e.currentTarget.value);
              }}
            />
          </div>
        </div>

        {/* Unidad de medida */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Unidad de Medida
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            value={unidad}
            onChange={function(e) {
              setUnidad(e.currentTarget.value);
            }}
          >
            <option value="unidad">Unidad</option>
            <option value="metros">Metros</option>
            <option value="kg">Kilogramos</option>
            <option value="litros">Litros</option>
            <option value="caja">Caja</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={function() { navigate("/Inventarios"); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-all font-medium cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-sm text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {loading ? "Guardando..." : (id != null ? "Guardar Cambios" : "Guardar")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistroProducto;
