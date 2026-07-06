import { useEffect } from 'react';
import Login from '../../components/Login/Login.jsx';

function LoginPage() {
  useEffect(function () { document.title = 'Iniciar Sesión — Estrucasa'; }, []);

  return (
    <Login />
  );
}

export default LoginPage;