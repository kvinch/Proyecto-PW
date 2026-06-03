import { useNavigate } from 'react-router-dom';

export default function InicioPage() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[calc(100vh-3rem)] bg-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="relative z-10 min-h-[calc(100vh-3rem)] flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold tracking-widest text-slate-400 uppercase shadow-sm">
            Sistema de Inventario
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6 tracking-tight">
            Bienvenido
          </h1>

          <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-lg mx-auto">
            Gestiona entradas, salidas, productos y usuarios de manera eficiente desde un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={function() { navigate('/Dashboard'); }}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Ir al Dashboard
            </button>
            <button
              type="button"
              onClick={function() { navigate('/Entradas'); }}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Nueva Entrada
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
