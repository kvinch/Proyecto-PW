import { useCallback, useState } from "react"
import usuarioService from "../services/usuarioService"

const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState([])

    const getUsuarios = useCallback(async () => {
        const service = usuarioService()
        const data = await service.getUsuarios()
        setUsuarios(data)
    }, [])

    const addUsuario = useCallback(async (usuario) => {
        const service = usuarioService()
        const data = await service.addUsuario(usuario)
        if (data.error) {
            console.error("Error: ", data.error)
        }
        return data
    }, [])

    const updateUsuario = useCallback(async (id, usuario) => {
        const service = usuarioService()
        const data = await service.updateUsuario(id, usuario)
        if (data.error) {
            console.error("Error: ", data.error)
        }
        return data
    }, [])

    const login = useCallback(async (credenciales) => {
        const service = usuarioService()
        const data = await service.login(credenciales)
        if (data.error) {
            console.error("Error: ", data.error)
        }
        return data
    }, [])

    const deleteUsuario = useCallback(async (id) => {
        const service = usuarioService()
        const data = await service.deleteUsuario(id)
        if (data.error) {
            console.error("Error: ", data.error)
        }
        return data
    }, [])

    const toggleEstadoUsuario = useCallback(async (id, estadoActual) => {
        const service = usuarioService()
        const data = await service.toggleEstadoUsuario(id, estadoActual)
        if (data.error) {
            console.error("Error: ", data.error)
        }
        return data
    }, [])

    return {
        usuarios,
        getUsuarios,
        addUsuario,
        updateUsuario,
        deleteUsuario,
        toggleEstadoUsuario,
        login
    }
}

export default useUsuarios
