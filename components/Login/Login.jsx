import FondoParticulas from "./FondoParticulas"
import { User, Lock, Boxes } from "lucide-react"

const Login = () => {
  return (
    <div>
      <FondoParticulas />
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-4xl rounded-3xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_30px_100px_-15px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col md:flex-row min-h-125">
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Boxes className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-800 tracking-wider">GESTIÓN DE INVENTARIOS</span>
            </div>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-slate-955 tracking-tight">NOMBRE DE LA EMPRESA</h1>
              <p className="text-sm text-slate-500 mt-2">Ingresa tus credenciales para iniciar sesión.</p>
            </div>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Usuario</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input type="text" placeholder="usuario"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="*******"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-sm text-white font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer">
                Ingresar
              </button>
            </form>
          </div>

          <div className="hidden md:flex w-1/2 bg-linear-to-br from-blue-600 via-blue-500 to-sky-400 
          p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-300/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

            <span className="self-start px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 z-10">
              Inventarios
            </span>
            <img className = "rounded-full"src = "https://connectmed.com.mx/wp-content/uploads/2024/10/2.png"/>
            <div className="mt-auto z-10">
              <h3 className="text-xl font-bold mb-2">Gestión Inteligente</h3>
              <p className="text-sm text-blue-50/90 leading-relaxed font-light">
                Optimiza, monitorea y controla el stock de tu negocio en tiempo real. Diseñado para simplificar la logística y distribución de tu empresa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

