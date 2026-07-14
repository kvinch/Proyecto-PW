import { useCallback, useState } from "react"
import inventarioService from "../services/inventarioService"

const useInventarioData = () => {
    const [productos, setProductos] = useState([])
    const [entradas, setEntradas] = useState([])
    const [salidas, setSalidas] = useState([])
    const [loading, setLoading] = useState(false)

    const cargarTodo = useCallback(async () => {
        setLoading(true)
        try {
            const service = inventarioService()
            const [productosData, entradasData, salidasData] = await Promise.all([
                service.getProductos(),
                service.getEntradas(),
                service.getSalidas()
            ])

            if (!productosData.error) setProductos(productosData)
            if (!entradasData.error) setEntradas(entradasData)
            if (!salidasData.error) setSalidas(salidasData)

            return { productos: productosData, entradas: entradasData, salidas: salidasData }
        } finally {
            setLoading(false)
        }
    }, [])

    const getProductos = async () => {
        const service = inventarioService()
        setLoading(true)
        try {
            const data = await service.getProductos()
            if (!data.error) setProductos(data)
            return data
        } finally {
            setLoading(false)
        }
    }

    const getProductoById = async (id) => {
        const service = inventarioService()
        return service.getProductoById(id)
    }

    const addProducto = async (producto) => {
        const service = inventarioService()
        return service.addProducto(producto)
    }

    const updateProducto = async (id, producto) => {
        const service = inventarioService()
        return service.updateProducto(id, producto)
    }

    const deleteProducto = async (id) => {
        const service = inventarioService()
        return service.deleteProducto(id)
    }

    const getEntradas = async () => {
        const service = inventarioService()
        const data = await service.getEntradas()
        if (!data.error) setEntradas(data)
        return data
    }

    const addEntrada = async (entrada) => {
        const service = inventarioService()
        const data = await service.addEntrada(entrada)
        if (!data.error) await cargarTodo()
        return data
    }

    const getSalidas = async () => {
        const service = inventarioService()
        const data = await service.getSalidas()
        if (!data.error) setSalidas(data)
        return data
    }

    const addSalida = async (salida) => {
        const service = inventarioService()
        const data = await service.addSalida(salida)
        if (!data.error) await cargarTodo()
        return data
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
        addEntrada,
        addEntradas: addEntrada,
        getSalidas,
        addSalida,
        cargarTodo
    }
}

export default useInventarioData
