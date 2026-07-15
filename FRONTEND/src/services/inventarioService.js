import { apiRequest } from "./api"

const inventarioService = () => {
    const getProductos = async () => {
        return apiRequest("/productos", {}, "Error al obtener los productos")
    }

    const getProductoById = async (id) => {
        return apiRequest(`/productos/${id}`, {}, "Producto no encontrado")
    }

    const addProducto = async (producto) => {
        return apiRequest("/productos", {
            method: "POST",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json"
            }
        }, "Error al crear el producto")
    }

    const updateProducto = async (id, producto) => {
        return apiRequest(`/productos/${id}`, {
            method: "PUT",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json"
            }
        }, "Error al actualizar el producto")
    }

    const deleteProducto = async (id) => {
        return apiRequest(`/productos/${id}`, {
            method: "DELETE"
        }, "Error al eliminar el producto")
    }

    const getEntradas = async () => {
        return apiRequest("/entradas", {}, "Error al obtener las entradas")
    }

    const addEntrada = async (entrada) => {
        return apiRequest("/entradas", {
            method: "POST",
            body: JSON.stringify(entrada),
            headers: {
                "Content-Type": "application/json"
            }
        }, "Error al registrar la entrada")
    }
    const getSalidas = async () => {
        return apiRequest("/salidas", {}, "Error al obtener las salidas")
    }

    const addSalida = async (salida) => {
        return apiRequest("/salidas", {
            method: "POST",
            body: JSON.stringify(salida),
            headers: {
                "Content-Type": "application/json"
            }
        }, "Error al registrar la salida")
    }

    return {
        getProductos,
        getProductoById,
        addProducto,
        updateProducto,
        deleteProducto,
        getEntradas,
        addEntrada,
        getSalidas,
        addSalida
    }
}

export default inventarioService
