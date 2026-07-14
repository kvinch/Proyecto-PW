const RUTA_BACKEND = "https://proyecto-pw-g7fa.onrender.com"

const usuarioService = () => {

    const getUsuarios = async () => {
        const resp = await fetch(`${RUTA_BACKEND}/api/users`)
        const data = await resp.json()
        return data
    }

    const addUsuario = async (usuario) => {
        const resp = await fetch(`${RUTA_BACKEND}/api/users`, {
            method: "post",
            body: JSON.stringify(usuario),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resp.ok) {
            console.error("Hubo error en la conexion")
            return await resp.json()
        }
        return await resp.json()
    }

    const updateUsuario = async (id, usuario) => {
        const resp = await fetch(`${RUTA_BACKEND}/api/users/${id}`, {
            method: "put",
            body: JSON.stringify(usuario),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resp.ok) {
            console.error("Hubo error en la conexion")
            return await resp.json()
        }
        return await resp.json()
    }

    const login = async (credenciales) => {
        const resp = await fetch(`${RUTA_BACKEND}/api/login`, {
            method: "post",
            body: JSON.stringify(credenciales),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resp.ok) {
            console.error("Hubo error en la conexion")
            return await resp.json()
        }
        return await resp.json()
    }

    return {
        getUsuarios,
        addUsuario,
        updateUsuario,
        login
    }
}

export default usuarioService
