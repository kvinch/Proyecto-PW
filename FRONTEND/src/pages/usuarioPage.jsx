import { useEffect } from "react";
import Usuarios from "../components/Usuarios/Usuarios";

function UsuarioPage() {
  useEffect(function () { document.title = 'Usuarios — Estrucasa'; }, []);

  return (
    <div>
      <Usuarios />
    </div>
  );
}

export default UsuarioPage;