/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    type: 'info', // 'error', 'success', 'warning', 'info'
  });

  const showAlert = useCallback((message, type = 'error') => {
    setAlertState({
      isOpen: true,
      message,
      type
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 shadow-sm ${
                alertState.type === 'error' ? 'bg-red-50 text-red-500 ring-4 ring-red-50' :
                alertState.type === 'success' ? 'bg-emerald-50 text-emerald-500 ring-4 ring-emerald-50' :
                'bg-blue-50 text-blue-500 ring-4 ring-blue-50'
              }`}>
                {alertState.type === 'error' && (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {alertState.type === 'success' && (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {alertState.type === 'info' && (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {alertState.type === 'error' ? 'Atención' : alertState.type === 'success' ? '¡Éxito!' : 'Información'}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{alertState.message}</p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-center border-t border-slate-100">
              <button
                onClick={hideAlert}
                className="w-full inline-flex justify-center items-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all active:scale-[0.98]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
