import { useEffect } from "react";
import Entradas from "../components/Entradas/Entradas";

function EntradasPage() {
  useEffect(function () { document.title = 'Entradas — Estrucasa'; }, []);

  return (
    <div>
      <Entradas />
    </div>
  );
}

export default EntradasPage;
