const API_URL = "https://proyecto-pw-g7fa.onrender.com"

async function parseResponse(resp, fallbackMessage) {
    const data = await resp.json().catch(function () {
        return {}
    })

    if (!resp.ok) {
        return {
            error: data.error || fallbackMessage
        }
    }

    return data
}

const inventarioService = () => {
    const getProductos = async () => {
        const resp = await fetch(`${API_URL}/productos`)
        return parseResponse(resp, "Error al obtener los productos")
    }

    const getProductoById = async (id) => {
        const resp = await fetch(`${API_URL}/productos/${id}`)
        return parseResponse(resp, "Producto no encontrado")
    }

    const addProducto = async (producto) => {
        const resp = await fetch(`${API_URL}/productos`, {
            method: "POST",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json"
            }
        })

        return parseResponse(resp, "Error al crear el producto")
    }

    const updateProducto = async (id, producto) => {
        const resp = await fetch(`${API_URL}/productos/${id}`, {
            method: "PUT",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json"
            }
        })

        return parseResponse(resp, "Error al actualizar el producto")
    }

    const deleteProducto = async (id) => {
        const resp = await fetch(`${API_URL}/productos/${id}`, {
            method: "DELETE"
        })

        if (resp.status === 204) {
            return { success: true }
        }

        return parseResponse(resp, "Error al eliminar el producto")
    }

    const getEntradas = async () => {
        const resp = await fetch(`${API_URL}/entradas`)
        return parseResponse(resp, "Error al obtener las entradas")
    }

    const addEntrada = async (entrada) => {
        const resp = await fetch(`${API_URL}/entradas`, {
            method: "POST",
            body: JSON.stringify(entrada),
            headers: {
                "Content-Type": "application/json"
            }
        })

        return parseResponse(resp, "Error al registrar la entrada")
    }
    const getSalidas = async () => {
        const resp = await fetch(`${API_URL}/salidas`)
        return parseResponse(resp, "Error al obtener las salidas")
    }

    const addSalida = async (salida) => {
        const resp = await fetch(`${API_URL}/salidas`, {
            method: "POST",
            body: JSON.stringify(salida),
            headers: {
                "Content-Type": "application/json"
            }
        })

        return parseResponse(resp, "Error al registrar la salida")
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
