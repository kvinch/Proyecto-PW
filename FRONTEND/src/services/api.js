export const API_URL = (import.meta.env.VITE_API_URL || "https://proyecto-pw-g7fa.onrender.com")
    .replace(/\/$/, "")

export async function apiRequest(path, options = {}, fallbackMessage = "Error al comunicarse con el servidor") {
    try {
        const response = await fetch(`${API_URL}${path}`, options)

        if (response.status === 204) return { success: true }

        const data = await response.json().catch(function () {
            return {}
        })

        if (!response.ok) {
            return { error: data.error || fallbackMessage }
        }

        return data
    } catch {
        return { error: fallbackMessage }
    }
}
