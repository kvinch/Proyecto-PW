import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { canAccessPath, useAuth } from '../../src/context/AuthContext';
import { 
  Home, 
  Package, 
  LayoutDashboard, 
  Settings, 
  History, 
  Menu, 
  Boxes,
  UserCircle,
  LogOut
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Inicio', path: '/Inicio' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/Dashboard' },
  { icon: Package, label: 'Entradas', path: '/Entradas' },
  { icon: Package, label: 'Salidas', path: '/Salidas' },
  { icon: Package, label: 'Inventarios', path: '/Inventarios' },
  { icon: History, label: 'Reportes', path: '/Historial-De-Movimientos' },
  { icon: Settings, label: 'Gestión de Usuarios', path: '/usuarios' }
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const visibleMenuItems = menuItems.filter((item) => canAccessPath(user?.rol, item.path));

  return (
    <nav className={`
      fixed top-0 left-0 z-40 h-screen bg-blue-50 border-r border-slate-200/80 p-4 
      flex flex-col justify-between duration-300 ease-in-out shadow-xs select-none
      ${open ? 'w-64' : 'w-20'}
    `}>
      
      <div>
        <div className="flex items-center justify-between h-12 px-2 mb-6">
          <div className="flex items-center gap-3 overflow-hidden transition-all duration-300">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shrink-0">
              <Boxes className="w-6 h-6" />
            </div>
            <span className={`text-xs font-bold text-slate-800 tracking-wider whitespace-nowrap transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 w-0'}`}>
              ESTRUCASA
            </span>
          </div>
          
          <button 
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className={`w-5 h-5 transition-transform duration-300 ${open ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <ul className="space-y-1">
          {visibleMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={index} className="relative group">
                <Link 
                  to={item.path}
                  className={`
                    w-full flex items-center rounded-xl p-3 text-sm font-medium
                    transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`} />
                  
                  <div className={`
                    grid transition-all duration-300 ease-in-out text-left
                    ${open ? 'grid-cols-[1fr] opacity-100 pl-3' : 'grid-cols-[0fr] opacity-0 pl-0'}
                  `}>
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.label}
                    </span>
                  </div>
                </Link>

                {!open && (
                  <div className="
                    absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2.5 py-1.5
                    bg-slate-900 text-white text-xs rounded-lg opacity-0 pointer-events-none
                    group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50 whitespace-nowrap shadow-md
                  ">
                    {item.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer: Perfil de Usuario Premium con Botón de Logout */}
      <div className="flex flex-col gap-2 p-2 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {open ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <UserCircle className="w-9 h-9 text-slate-400 shrink-0" />
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-xs font-bold text-slate-800 truncate" title={user?.nombre}>
                  {user?.nombre || 'Invitado'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {user?.rol || 'Usuario'} {user?.usuario ? `@${user.usuario}` : ''}
                </p>
              </div>
            </div>
            <button 
              onClick={logout} 
              title="Cerrar sesión"
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <UserCircle className="w-9 h-9 text-slate-400" title={`${user?.nombre || 'Invitado'} (${user?.rol || 'Usuario'})`} />
            <button 
              onClick={logout} 
              title="Cerrar sesión"
              className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </nav>
  );
}
