const API_URL = "http://localhost:5000"

const inventarioService = () => {

    // ─── Productos ───────────────────────────────────────────────

    const getProductos = async () => {
        const resp = await fetch(`${API_URL}/productos`)
        const data = await resp.json()
        return data
    }

    const getProductoById = async (id) => {
        const resp = await fetch(`${API_URL}/productos/${id}`)

        if (!resp.ok) {
            console.error("Producto no encontrado")
            return { error: "Producto no encontrado" }
        }
        return await resp.json()
    }

    const addProducto = async (producto) => {
        const resp = await fetch(`${API_URL}/productos`, {
            method: "POST",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resp.ok) {
            console.error("Hubo error al crear el producto")
            return await resp.json()
        }
        return await resp.json()
    }

    const updateProducto = async (id, producto) => {
        const resp = await fetch(`${API_URL}/productos/${id}`, {
            method: "PUT",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resp.ok) {
            console.error("Hubo error al actualizar el producto")
            return await resp.json()
        }
        return await resp.json()
    }

    const deleteProducto = async (id) => {
        const resp = await fetch(`${API_URL}/productos/${id}`, {
            method: "DELETE"
        })

        if (!resp.ok) {
            console.error("Hubo error al eliminar el producto")
            const data = await resp.json().catch(() => ({}))
            return { error: data.error || "Error al eliminar el producto" }
        }
        return await resp.json().catch(() => ({ success: true }))
    }

    // ─── Entradas ────────────────────────────────────────────────

    const getEntradas = async () => {
        const resp = await fetch(`${API_URL}/entradas`)
        const data = await resp.json()
        return data
    }

    // ─── Salidas ─────────────────────────────────────────────────

    const getSalidas = async () => {
        const resp = await fetch(`${API_URL}/salidas`)
        const data = await resp.json()
        return data
    }

    return {
        getProductos,
        getProductoById,
        addProducto,
        updateProducto,
        deleteProducto,
        getEntradas,
        getSalidas
    }
}

export default inventarioService
