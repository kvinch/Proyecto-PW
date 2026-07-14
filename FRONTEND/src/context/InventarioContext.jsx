import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = "http://localhost:5000";
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

  // Carga de datos desde el backend
  const cargarDatos = useCallback(async function () {
    try {
      setLoading(true);

      const [productosRes, entradasRes, salidasRes] = await Promise.all([
        fetch(`${API_URL}/productos`),
        fetch(`${API_URL}/entradas`),
        fetch(`${API_URL}/salidas`)
      ]);

      if (!productosRes.ok || !entradasRes.ok || !salidasRes.ok) {
        throw new Error("Error al cargar datos del backend");
      }

      const productosData = await productosRes.json();
      const entradasData = await entradasRes.json();
      const salidasData = await salidasRes.json();

      setProductos(productosData);
      setEntradas(entradasData);
      setSalidas(salidasData);
    } catch (error) {
      console.error("Error cargando datos del inventario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function () {
    cargarDatos();
  }, [cargarDatos]);

  // Re-sincronizar desde el backend
  function refrescar() {
    cargarDatos();
  }

  return (
    <InventarioContext.Provider value={{
      productos,
      entradas,
      salidas,
      loading,
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
