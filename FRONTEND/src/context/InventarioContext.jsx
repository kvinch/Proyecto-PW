/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import inventarioService from '../services/inventarioService';

const InventarioContext = createContext(null);

/**
 * Context compartido que centraliza el estado de inventario, entradas y salidas.
 * Los datos se obtienen desde el backend (Express + Prisma + PostgreSQL).
 */
export function InventarioProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carga de datos desde el backend usando el service centralizado
  const cargarDatos = useCallback(async function () {
    try {
      setLoading(true);

      const service = inventarioService();
      const [productosData, entradasData, salidasData] = await Promise.all([
        service.getProductos(),
        service.getEntradas(),
        service.getSalidas()
      ]);

      if (!productosData.error) {
        setProductos(productosData);
      }
      if (!entradasData.error) {
        setEntradas(entradasData);
      }
      if (!salidasData.error) {
        setSalidas(salidasData);
      }
    } catch (error) {
      console.error("Error cargando datos del inventario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function () {
    const timer = setTimeout(function () {
      cargarDatos();
    }, 0);

    return function () {
      clearTimeout(timer);
    };
  }, [cargarDatos]);

  // Re-sincronizar desde el backend
  function refrescar() {
    cargarDatos();
  }

  async function addEntrada(entrada) {
    const service = inventarioService();
    setSaving(true);
    try {
      const respuesta = await service.addEntrada(entrada);
      if (!respuesta.error) {
        await cargarDatos();
      }
      return respuesta;
    } finally {
      setSaving(false);
    }
  }

  async function addSalida(salida) {
    const service = inventarioService();
    setSaving(true);
    try {
      const respuesta = await service.addSalida(salida);
      if (!respuesta.error) {
        await cargarDatos();
      }
      return respuesta;
    } finally {
      setSaving(false);
    }
  }

  return (
    <InventarioContext.Provider value={{
      productos,
      entradas,
      salidas,
      loading,
      saving,
      refrescar,
      addEntrada,
      addSalida
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
