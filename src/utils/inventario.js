// Funciones centralizadas para la lógica de stock crítico.
// Evita duplicar la regla stock <= stockMinimo en múltiples archivos.

/**
 * Determina si un producto tiene stock crítico.
 * Regla: stock actual <= stock mínimo.
 */
export function esCritico(producto) {
  return Number(producto.stock || 0) <= Number(producto.stockMinimo || 0);
}

/**
 * Determina si un producto tiene stock en riesgo (no crítico pero cercano).
 * Regla: no es crítico, pero stock <= stockMinimo * 1.5.
 */
export function isStockEnRiesgo(producto) {
  if (esCritico(producto)) return false;
  return Number(producto.stock || 0) <= Number(producto.stockMinimo || 0) * 1.5;
}

/**
 * Cuenta la cantidad de productos en estado crítico.
 */
export function contarCriticos(productos) {
  return productos.filter(esCritico).length;
}
