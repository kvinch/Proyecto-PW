import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCw, Package, AlertTriangle } from 'lucide-react';
import ItemProducto from './ItemProducto';

// RF-10: Datos mock iniciales de inventario
const productosMock = [
  {
    id: 1,
    nombre: "Cable UTP Cat 6",
    categoria: "Redes",
    stock: 5,
    stockMinimo: 10,
    unidad: "metros"
  },
  {
    id: 2,
    nombre: "Switch 24 puertos",
    categoria: "Equipos",
    stock: 3,
    stockMinimo: 2,
    unidad: "unidad"
  },
  {
    id: 3,
    nombre: "Conectores RJ45",
    categoria: "Materiales",
    stock: 100,
    stockMinimo: 50,
    unidad: "unidad"
  }
];

function Inventario() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [stockFilter, setStockFilter] = useState('Todos'); // RF-12: filtro por nivel de stock

  // Carga inicial desde localStorage
  useEffect(function () {
    const saved = localStorage.getItem('inventario_app');
    if (saved != null) {
      try {
        setProductos(JSON.parse(saved));
      } catch (e) {
        console.error("Error al parsear localStorage", e);
        setProductos(productosMock);
      }
    } else {
      setProductos(productosMock);
      localStorage.setItem('inventario_app', JSON.stringify(productosMock));
    }
  }, []);

  // Función para guardar en localStorage y actualizar estado local
  function updateProductosList(newList) {
    setProductos(newList);
    localStorage.setItem('inventario_app', JSON.stringify(newList));
  }

  // Eliminar un producto de la lista
  function handleDeleteProducto(id) {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const filtered = productos.filter(function (p) {
        return p.id !== id;
      });
      updateProductosList(filtered);
    }
  }

  // Limpiar todos los filtros aplicados
  function handleResetFilters() {
    setBusqueda('');
    setCategoriaFilter('Todas');
    setStockFilter('Todos');
  }

  // RF-12: Filtrado de productos por nombre, categoría y nivel de stock
  const productosFiltrados = productos.filter(function (p) {
    const matchesSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchesCategoria = categoriaFilter === 'Todas' || p.categoria === categoriaFilter;

    // Filtro por nivel de stock
    let matchesStock = true;
    if (stockFilter === 'Critico') {
      matchesStock = p.stock <= p.stockMinimo;
    } else if (stockFilter === 'EnRiesgo') {
      matchesStock = p.stock > p.stockMinimo && p.stock <= p.stockMinimo * 1.5;
    } else if (stockFilter === 'Normal') {
      matchesStock = p.stock > p.stockMinimo * 1.5;
    }

    return matchesSearch && matchesCategoria && matchesStock;
  });

  // RF-13: Conteo de productos en stock crítico para la alerta del encabezado
  const totalCriticos = productos.filter(function (p) {
    return p.stock <= p.stockMinimo;
  }).length;

  return (
    <div className="space-y-6">

      {/* RF-13: Banner de alerta si hay productos en stock crítico */}
      {totalCriticos > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-sm font-medium">
            {totalCriticos === 1
              ? '1 producto tiene stock crítico.'
              : `${totalCriticos} productos tienen stock crítico.`}
            {' '}Revisa el inventario.
          </p>
          {/* Acceso rápido al filtro de stock crítico */}
          <button
            onClick={function () { setStockFilter('Critico'); }}
            className="ml-auto text-xs font-semibold underline underline-offset-2 hover:text-rose-900 transition-colors cursor-pointer"
          >
            Ver críticos
          </button>
        </div>
      )}

      {/* Cabecera con controles de filtro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">

        {/* RF-12: Barra de búsqueda por nombre */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de producto..."
            value={busqueda}
            onChange={function (e) {
              setBusqueda(e.currentTarget.value);
            }}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Filtros y Acción */}
        <div className="flex flex-wrap items-center gap-3">

          {/* RF-12: Selector de Categoría */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={categoriaFilter}
              onChange={function (e) {
                setCategoriaFilter(e.currentTarget.value);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Redes">Redes</option>
              <option value="Equipos">Equipos</option>
              <option value="Materiales">Materiales</option>
              <option value="Herramientas">Herramientas</option>
            </select>
          </div>

          {/* RF-12: Selector de nivel de stock */}
          <select
            value={stockFilter}
            onChange={function (e) {
              setStockFilter(e.currentTarget.value);
            }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
          >
            <option value="Todos">Todos los niveles</option>
            <option value="Normal">Stock normal</option>
            <option value="EnRiesgo">Stock en riesgo</option>
            <option value="Critico">Stock crítico</option>
          </select>

          {/* Limpiar filtros (sólo visible si hay alguno activo) */}
          {(busqueda || categoriaFilter !== 'Todas' || stockFilter !== 'Todos') && (
            <button
              onClick={handleResetFilters}
              title="Restablecer filtros"
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* RF-10: Botón para registrar nuevo producto */}
          <button
            onClick={function () {
              navigate("/Inventarios/nuevo");
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Unidad</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {productosFiltrados.length > 0 ? (
                // Mapeo utilizando props en componentes hijos de manera idéntica al ejemplo del profesor
                productosFiltrados.map(function (producto, index) {
                  return (
                    <ItemProducto
                      key={"producto" + index}
                      num={index + 1}
                      nombre={producto.nombre}
                      categoria={producto.categoria}
                      stock={producto.stock}
                      stockMinimo={producto.stockMinimo}
                      unidad={producto.unidad}
                      onEdit={function () {
                        navigate("/Inventarios/editar/" + producto.id);
                      }}
                      onDelete={function () {
                        handleDeleteProducto(producto.id);
                      }}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 px-6">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Package className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                      <span className="font-semibold text-sm">No se encontraron productos</span>
                      <span className="text-xs text-slate-400">Intenta cambiar el filtro o agrega un nuevo producto.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total de productos */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando <span className="font-semibold text-slate-700">{productosFiltrados.length}</span> de <span className="font-semibold text-slate-700">{productos.length}</span> productos en total</span>
        </div>
      </div>
    </div>
  );
}

export default Inventario;
