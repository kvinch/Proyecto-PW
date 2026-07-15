import { useCallback, useEffect, useState } from "react"
import dashboardService from "../services/dashboardService"

const estadoInicial = {
    totales: {
        productos: 0,
        stock: 0,
        entradas: 0,
        salidas: 0,
        unidadesEntrada: 0,
        unidadesSalida: 0,
        criticos: 0
    },
    productos: [],
    productosCriticos: [],
    movimientosRecientes: []
}

const useDashboardData = () => {
    const [resumen, setResumen] = useState(estadoInicial)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const cargarResumen = useCallback(async () => {
        setLoading(true)
        setError("")

        const data = await dashboardService().getResumen()
        if (data.error) {
            setError(data.error)
        } else {
            setResumen(data)
        }
        setLoading(false)

        return data
    }, [])

    useEffect(function () {
        const timer = setTimeout(cargarResumen, 0)
        return function () { clearTimeout(timer) }
    }, [cargarResumen])

    return { ...resumen, loading, error, refrescar: cargarResumen }
}

export default useDashboardData
