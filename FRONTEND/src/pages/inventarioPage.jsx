import { useEffect } from "react";
import Inventario from "../components/Inventario/Inventario";

function InventarioPage() {
  useEffect(function () { document.title = 'Inventario — Estrucasa'; }, []);

  return (
    <div>
      <Inventario />
    </div>
  );
}

export default InventarioPage;
