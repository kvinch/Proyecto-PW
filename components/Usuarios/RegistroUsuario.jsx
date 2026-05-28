import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus, ArrowLeft, Save } from "lucide-react";

function RegistroUsuario() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el ID de la URL si estamos editando

  // Declaración de estados locales
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("Operario");
  const [estado, setEstado] = useState("Activo");

  // Si hay un ID en la URL, cargamos los datos del usuario correspondiente para editarlos
  useEffect(function() {
    if (id != null) {
      const listaUsuariosStr = localStorage.getItem("usuarios_app");
      if (listaUsuariosStr != null) {
        const listaUsuarios = JSON.parse(listaUsuariosStr);
        // Buscamos al usuario por su ID
        const usuarioEncontrado = listaUsuarios.find(function(u) {
          return u.id === Number(id);
        });
        
        if (usuarioEncontrado != null) {
          setNombre(usuarioEncontrado.nombre);
          setUsuario(usuarioEncontrado.usuario);
          setContraseña(usuarioEncontrado.contraseña || "");
          setRol(usuarioEncontrado.rol);
          setEstado(usuarioEncontrado.estado);
        }
      }
    }
  }, [id]);

  // Función guardar con soporte para creación y edición
  function guardarUsuario() {
    if (nombre.trim() === "" || usuario.trim() === "" || contraseña.trim() === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const listaUsuariosStr = localStorage.getItem("usuarios_app");
    let listaUsuarios = [];
    
    if (listaUsuariosStr != null) {
      listaUsuarios = JSON.parse(listaUsuariosStr);
    }

    if (id != null) {
      // Acá entra al modo edición del usuario

      // Verificar si el nombre de usuario ya está tomado por OTRO usuario
      const existeOtro = listaUsuarios.some(function(u) {
        return u.usuario === usuario.trim().toLowerCase() && u.id !== Number(id);
      });

      if (existeOtro) {
        alert("El nombre de usuario @" + usuario + " ya está en uso por otro usuario.");
        return;
      }

      // Mapeamos para actualizar los datos del usuario modificado
      listaUsuarios = listaUsuarios.map(function(u) {
        if (u.id === Number(id)) {
          return {
            ...u,
            nombre: nombre.trim(),
            usuario: usuario.trim().toLowerCase(),
            contraseña: contraseña.trim(),
            rol: rol,
            estado: estado
          };
        }
        return u;
      });

    } else {
     //Si no entra en modo edición, entonces entra a modo creación
      const existe = listaUsuarios.some(function(u) {
        return u.usuario === usuario.trim().toLowerCase();
      });

      if (existe) {
        alert("El nombre de usuario @" + usuario + " ya existe.");
        return;
      }

      listaUsuarios.push({
        id: Date.now(),
        nombre: nombre.trim(),
        usuario: usuario.trim().toLowerCase(),
        contraseña: contraseña.trim(),
        rol: rol,
        estado: estado
      });
    }
    
    localStorage.setItem("usuarios_app", JSON.stringify(listaUsuarios));

    // Redirige de vuelta a la lista de usuarios
    navigate("/usuarios");
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Cabecera premium dinámica */}
      <div className="flex items-center gap-3 px-6 py-5 bg-slate-50 border-b border-slate-200/60">
        <button
          type="button"
          onClick={function() { navigate("/usuarios"); }}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h1 className="font-bold text-xl text-slate-800">
            {id != null ? "Editar Usuario" : "Registro de Nuevo Usuario"}
          </h1>
        </div>
      </div>

      {/* Formulario */}
      <form className="p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Nombre Completo
          </label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            type="text"
            placeholder="Ej. Juan Pérez"
            value={nombre}
            onChange={function(e) {
              setNombre(e.currentTarget.value);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Nombre de Usuario
          </label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            type="text"
            placeholder="Ej. jperez"
            value={usuario}
            onChange={function(e) {
              setUsuario(e.currentTarget.value);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Contraseña
          </label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            type="password"
            placeholder="******"
            value={contraseña}
            onChange={function(e) {
              setContraseña(e.currentTarget.value);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Rol de Usuario
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            value={rol}
            onChange={function(e) {
              setRol(e.currentTarget.value);
            }}
          >
            <option value="Administrador">Administrador</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Operario">Operario</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Estado
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            value={estado}
            onChange={function(e) {
              setEstado(e.currentTarget.value);
            }}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={function() { navigate("/usuarios"); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-all font-medium cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-sm text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
            onClick={guardarUsuario}
          >
            <Save className="w-4 h-4" />
            {id != null ? "Guardar Cambios" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistroUsuario;
