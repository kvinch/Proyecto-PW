import { useEffect } from 'react';
import RegistroUsuario from '../../components/Usuarios/RegistroUsuario.jsx';

function RegistroUsuarioPage() {
  useEffect(function () { document.title = 'Registro de Usuario — Estrucasa'; }, []);

  return (
    <div className="p-6">
      <RegistroUsuario />
    </div>
  );
}

export default RegistroUsuarioPage;