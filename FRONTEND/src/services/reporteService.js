import { apiRequest } from "./api"

function crearQuery(filtros = {}) {
    const query = new URLSearchParams()

    Object.entries(filtros).forEach(function ([campo, valor]) {
        if (valor !== undefined && valor !== null && valor !== "" && valor !== "todos") {
            query.set(campo, valor)
        }
    })

    const texto = query.toString()
    return texto ? `?${texto}` : ""
}

const reporteService = () => {
    const getMovimientos = async (filtros) => {
        return apiRequest(
            `/reportes/movimientos${crearQuery(filtros)}`,
            {},
            "Error al generar el reporte de movimientos"
        )
    }

    const getStockCritico = async () => {
        return apiRequest(
            "/reportes/stock-critico",
            {},
            "Error al obtener el stock critico"
        )
    }

    const getCategorias = async () => {
        return apiRequest(
            "/reportes/categorias",
            {},
            "Error al obtener el reporte por categorias"
        )
    }

    const getProducto = async (id) => {
        return apiRequest(
            `/reportes/producto/${id}`,
            {},
            "Error al obtener el reporte del producto"
        )
    }

    return { getMovimientos, getStockCritico, getCategorias, getProducto }
}

export default reporteService
