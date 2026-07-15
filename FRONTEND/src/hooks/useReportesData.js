import { useCallback, useEffect, useState } from "react"
import reporteService from "../services/reporteService"

const resumenInicial = {
    movimientos: 0,
    unidadesEntrada: 0,
    unidadesSalida: 0,
    balance: 0
}

const useReportesData = () => {
    const [movimientos, setMovimientos] = useState([])
    const [resumen, setResumen] = useState(resumenInicial)
    const [productosCriticos, setProductosCriticos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const cargarReportes = useCallback(async (filtros = {}) => {
        setLoading(true)
        setError("")

        const service = reporteService()
        const [movimientosData, criticosData, categoriasData] = await Promise.all([
            service.getMovimientos(filtros),
            service.getStockCritico(),
            service.getCategorias()
        ])

        const primerError = movimientosData.error || criticosData.error || categoriasData.error
        if (primerError) {
            setError(primerError)
        }
        if (!movimientosData.error) {
            setMovimientos(movimientosData.movimientos)
            setResumen(movimientosData.resumen)
        }
        if (!criticosData.error) setProductosCriticos(criticosData)
        if (!categoriasData.error) setCategorias(categoriasData)

        setLoading(false)
        return { movimientos: movimientosData, criticos: criticosData, categorias: categoriasData }
    }, [])

    useEffect(function () {
        const timer = setTimeout(function () { cargarReportes() }, 0)
        return function () { clearTimeout(timer) }
    }, [cargarReportes])

    return {
        movimientos,
        resumen,
        productosCriticos,
        categorias,
        loading,
        error,
        buscar: cargarReportes,
        refrescar: cargarReportes
    }
}

export default useReportesData
