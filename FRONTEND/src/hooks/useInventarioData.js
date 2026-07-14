import { useState } from "react"
import inventarioService from "../services/inventarioService"

const useInventarioData = () => {
    const [productos, setProductos] = useState([])
    const [entradas, setEntradas] = useState([])
    const [salidas, setSalidas] = useState([])
    const [loading, setLoading] = useState(false)

    // ─── Productos ───────────────────────────────────────────────

    const getProductos = async () => {
        const service = inventarioService()
        setLoading(true)
        try {
            const data = await service.getProductos()
            setProductos(data)
        } catch (err) {
            console.error("Error al obtener productos:", err)
        } finally {
            setLoading(false)
        }
    }

    const getProductoById = async (id) => {
        const service = inventarioService()
        const data = await service.getProductoById(id)
        if (data.error) {
            console.error("Error:", data.error)
        }
        return data
    }

    const addProducto = async (producto) => {
        const service = inventarioService()
        const data = await service.addProducto(producto)
        if (data.error) {
            console.error("Error:", data.error)
        }
        return data
    }

    const updateProducto = async (id, producto) => {
        const service = inventarioService()
        const data = await service.updateProducto(id, producto)
        if (data.error) {
            console.error("Error:", data.error)
        }
        return data
    }

    const deleteProducto = async (id) => {
        const service = inventarioService()
        const data = await service.deleteProducto(id)
        if (data.error) {
            console.error("Error:", data.error)
        }
        return data
    }

    // ─── Entradas ────────────────────────────────────────────────

    const getEntradas = async () => {
        const service = inventarioService()
        const data = await service.getEntradas()
        setEntradas(data)
    }

    // ─── Salidas ─────────────────────────────────────────────────

    const getSalidas = async () => {
        const service = inventarioService()
        const data = await service.getSalidas()
        setSalidas(data)
    }

    // ─── Cargar todo ─────────────────────────────────────────────

    const cargarTodo = async () => {
        setLoading(true)
        try {
            const service = inventarioService()
            const [productosData, entradasData, salidasData] = await Promise.all([
                service.getProductos(),
                service.getEntradas(),
                service.getSalidas()
            ])
            setProductos(productosData)
            setEntradas(entradasData)
            setSalidas(salidasData)
        } catch (err) {
            console.error("Error al cargar datos:", err)
        } finally {
            setLoading(false)
        }
    }

    return {
        productos,
        entradas,
        salidas,
        loading,
        getProductos,
        getProductoById,
        addProducto,
        updateProducto,
        deleteProducto,
        getEntradas,
        getSalidas,
        cargarTodo
    }
}

export default useInventarioData
