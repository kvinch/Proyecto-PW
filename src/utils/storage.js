// Utilidad compartida para lectura segura de arrays desde localStorage.
// Elimina la duplicación de getStorageArray en Dashboard.jsx e InventarioResumen.jsx (B4).

/**
 * Lee un array desde localStorage de forma segura.
 * Devuelve [] si la clave no existe, no es JSON válido o no es un array.
 */
export function getStorageArray(key) {
  const raw = localStorage.getItem(key);
  if (raw == null) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error leyendo ' + key, error);
    return [];
  }
}
