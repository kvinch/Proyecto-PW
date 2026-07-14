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
