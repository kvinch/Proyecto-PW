import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlus, ArrowLeft, Save } from "lucide-react";
import { useAlert } from "../../context/AlertContext.jsx";
import useUsuarios from "../../hooks/useUsuarios.js";

function RegistroUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showAlert } = useAlert();
  const { getUsuarios, addUsuario, updateUsuario } = useUsuarios();

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("Operario");
  const [estado, setEstado] = useState("Activo");
  const [cargando, setCargando] = useState(false);

  // Si hay un ID en la URL, cargamos los datos del usuario desde el backend para editarlos
  useEffect(function() {
    if (id != null) {
      async function cargarUsuario() {
        const { usuarios } = await getUsuarios();
        const lista = Array.isArray(usuarios) ? usuarios : [];
        const encontrado = lista.find(function(u) {
          return u.id === Number(id);
        });
        if (encontrado != null) {
          setNombre(encontrado.nombre);
          setUsuario(encontrado.usuario);
          setRol(encontrado.rol);
          setEstado(encontrado.estado);
        }
      }
      cargarUsuario();
    }
  }, [id]);

  async function guardarUsuario(e) {
    e.preventDefault();

    if (nombre.trim() === "" || usuario.trim() === "") {
      showAlert("Por favor, completa todos los campos obligatorios.", "warning");
      return;
    }

    if (id == null && contrasena.trim() === "") {
      showAlert("La contraseña es obligatoria al crear un usuario.", "warning");
      return;
    }

    setCargando(true);

    try {
      let resultado;

      if (id != null) {
        // Modo edición — solo enviamos contrasena si se llenó el campo
        const datos = { nombre, usuario, rol, estado };
        if (contrasena.trim() !== "") {
          datos.contrasena = contrasena;
        }
        resultado = await updateUsuario(id, datos);
      } else {
        // Modo creación
        resultado = await addUsuario({ nombre, usuario, contrasena, rol, estado });
      }

      if (resultado?.error) {
        showAlert(resultado.error, "error");
        return;
      }

      navigate("/usuarios");
    } catch (err) {
      showAlert("Ocurrió un error al guardar. Intenta de nuevo.", "error");
    } finally {
      setCargando(false);
    }
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

      <form className="p-6 space-y-5" onSubmit={guardarUsuario}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Nombre Completo
          </label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            type="text"
            placeholder="Ej. Juan Pérez"
            value={nombre}
            onChange={function(e) { setNombre(e.currentTarget.value); }}
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
            onChange={function(e) { setUsuario(e.currentTarget.value); }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Contraseña {id != null && <span className="text-slate-400 normal-case font-normal">(dejar vacío para no cambiar)</span>}
          </label>
          <input
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            type="password"
            placeholder={id != null ? "••••••  (sin cambios)" : "******"}
            value={contrasena}
            onChange={function(e) { setContrasena(e.currentTarget.value); }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Rol de Usuario
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            value={rol}
            onChange={function(e) { setRol(e.currentTarget.value); }}
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
            onChange={function(e) { setEstado(e.currentTarget.value); }}
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
            type="submit"
            disabled={cargando}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-sm text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cargando ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {id != null ? "Guardar Cambios" : "Guardar"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistroUsuario;
