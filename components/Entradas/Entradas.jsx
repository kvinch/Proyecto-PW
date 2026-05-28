
import React, { useEffect, useState } from "react";
import { Plus, ArrowDownCircle } from "lucide-react";
import TablaEntradas from "./TablaEntradas";




function Entradas() {

  const [productos, setProductos] = useState([]);

  const [entradas, setEntradas] = useState([]);

  const [formData, setFormData] = useState({
    producto: "",
    cantidad: "",
    proveedor: "",
    responsable: "",
    fecha: "",
    observacion: ""
  });

  // Cargar productos del inventario

useEffect(function () {

  // Cargar productos
  const inventarioGuardado =
    localStorage.getItem("inventario_app");

  if (inventarioGuardado != null) {

    setProductos(
      JSON.parse(inventarioGuardado)
    );

  }

  // Cargar historial de entradas
  const entradasGuardadas =
    localStorage.getItem("entradas_app");

  if (entradasGuardadas != null) {

    setEntradas(
      JSON.parse(entradasGuardadas)
    );

  }

}, []);



  // Manejar cambios
  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.currentTarget.value
    });

  }

  // Registrar entrada
  function registrarEntrada(e) {

    e.preventDefault();

    if (
      formData.producto === "" ||
      formData.cantidad === "" ||
      formData.proveedor === "" ||
      formData.responsable === "" ||
      formData.fecha === ""
    ) {

      alert("Completa todos los campos.");
      return;

    }

    const nuevaEntrada = {
      id: Date.now(),
      ...formData
    };

    const entradasGuardadas =
      localStorage.getItem("entradas_app");

    let listaEntradas = [];

    if (entradasGuardadas != null) {

      listaEntradas =
        JSON.parse(entradasGuardadas);

    }

    listaEntradas.push(nuevaEntrada);


// RF-16: Actualización automática del stock

const inventarioGuardado =
  localStorage.getItem("inventario_app");

if (inventarioGuardado != null) {

  let inventario =
    JSON.parse(inventarioGuardado);

  inventario = inventario.map(function(producto) {

    if (producto.nombre === formData.producto) {

      return {
        ...producto,
        stock:
          Number(producto.stock) +
          Number(formData.cantidad)
      };

    }

    return producto;

  });

  localStorage.setItem(
    "inventario_app",
    JSON.stringify(inventario)
  );

}



    localStorage.setItem(
      "entradas_app",
      JSON.stringify(listaEntradas)
    );

    setEntradas(listaEntradas);

    alert("Entrada registrada correctamente.");

    // Limpiar formulario
    setFormData({
      producto: "",
      cantidad: "",
      proveedor: "",
      responsable: "",
      fecha: "",
      observacion: ""
    });

  }

  return (

    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">

      {/* Cabecera */}

      <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border-b border-slate-200/60">

        <ArrowDownCircle className="w-5 h-5 text-emerald-600" />

        <h1 className="font-bold text-xl text-slate-800">
          Registro de Entradas
        </h1>

      </div>

      {/* Formulario */}

      <form
        onSubmit={registrarEntrada}
        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        {/* Producto */}

        <div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Producto
          </label>

          <select
            name="producto"
            value={formData.producto}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          >

            <option value="">
              Seleccionar producto
            </option>

            {productos.map(function(producto) {

              return (
                <option
                  key={producto.id}
                  value={producto.nombre}
                >
                  {producto.nombre}
                </option>
              );

            })}

          </select>

        </div>

        {/* Cantidad */}

        <div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Cantidad
          </label>

          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />

        </div>

        {/* Proveedor */}

        <div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Proveedor
          </label>

          <input
            type="text"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />

        </div>

        {/* Responsable */}

        <div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Responsable
          </label>

          <input
            type="text"
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />

        </div>

        {/* Fecha */}

        <div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Fecha
          </label>

          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />

        </div>

        {/* Observación */}

        <div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Observación
          </label>

          <input
            type="text"
            name="observacion"
            value={formData.observacion}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          />

        </div>

        {/* Botón */}

        <div className="md:col-span-2 flex justify-end">

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >

            <Plus className="w-4 h-4" />

            Registrar Entrada

          </button>

        </div>

      </form>


    <TablaEntradas entradas={entradas} />





    </div>

  );

}

export default Entradas;

