import { apiRequest } from "./api"

const dashboardService = () => {
    const getResumen = async () => {
        return apiRequest(
            "/dashboard/resumen",
            {},
            "Error al obtener el resumen del dashboard"
        )
    }

    return { getResumen }
}

export default dashboardService
