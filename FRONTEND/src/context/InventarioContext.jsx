import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorageArray } from '../utils/storage';

const InventarioContext = createContext(null);

/**
 * Context compartido que centraliza el estado de inventario, entradas y salidas.
 * Resuelve el problema A1: los módulos leían localStorage de forma aislada en su useEffect,
 * por lo que si un componente ya estaba montado (ej. Dashboard) no se refrescaba
 * al cambiar datos en otro módulo (ej. Entradas).
 */
export function InventarioProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);

  // Carga inicial desde localStorage
  const cargarDatos = useCallback(function () {
    setProductos(getStorageArray('inventario_app'));
    setEntradas(getStorageArray('entradas_app'));
    setSalidas(getStorageArray('salidas_app'));
  }, []);

  useEffect(function () {
    cargarDatos();

    // Sincronización entre pestañas mediante el evento storage
    function handleStorage(e) {
      if (e.key === 'inventario_app' || e.key === 'entradas_app' || e.key === 'salidas_app') {
        cargarDatos();
      }
    }

    window.addEventListener('storage', handleStorage);
    return function () {
      window.removeEventListener('storage', handleStorage);
    };
  }, [cargarDatos]);

  // Actualizar productos y persistir en localStorage
  function actualizarProductos(nuevosProductos) {
    setProductos(nuevosProductos);
    localStorage.setItem('inventario_app', JSON.stringify(nuevosProductos));
  }

  // Actualizar entradas y persistir en localStorage
  function actualizarEntradas(nuevasEntradas) {
    setEntradas(nuevasEntradas);
    localStorage.setItem('entradas_app', JSON.stringify(nuevasEntradas));
  }

  // Actualizar salidas y persistir en localStorage
  function actualizarSalidas(nuevasSalidas) {
    setSalidas(nuevasSalidas);
    localStorage.setItem('salidas_app', JSON.stringify(nuevasSalidas));
  }

  // Re-sincronizar manualmente (útil al navegar entre rutas)
  function refrescar() {
    cargarDatos();
  }

  return (
    <InventarioContext.Provider value={{
      productos,
      entradas,
      salidas,
      actualizarProductos,
      actualizarEntradas,
      actualizarSalidas,
      refrescar
    }}>
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  const context = useContext(InventarioContext);
  if (!context) {
    throw new Error('useInventario debe usarse dentro de InventarioProvider');
  }
  return context;
}
