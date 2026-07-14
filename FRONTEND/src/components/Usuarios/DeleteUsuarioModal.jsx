import { Trash2, AlertTriangle, X } from 'lucide-react';

function DeleteUsuarioModal({ usuario, onConfirm, onCancel }) {
  if (!usuario) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>
            <h2 className="font-bold text-slate-800 text-base">Eliminar usuario</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="flex gap-3.5">
            <div className="shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-700 leading-relaxed">
                ¿Estás seguro de que deseas eliminar al usuario{' '}
                <span className="font-semibold text-slate-900">{usuario.nombre}</span>
                {' '}(<span className="font-mono text-slate-500 text-xs">@{usuario.usuario}</span>)?
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-white transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm hover:shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUsuarioModal;
