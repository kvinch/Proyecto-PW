import { useEffect } from "react";
import Salidas from "../../components/Salidas/Salidas";

function SalidasPage() {
  useEffect(function () { document.title = 'Salidas — Estrucasa'; }, []);

  return (
    <div>
      <Salidas />
    </div>
  );
}

export default SalidasPage;
