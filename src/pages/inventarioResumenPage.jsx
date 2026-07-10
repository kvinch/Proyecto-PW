import { useEffect } from 'react';
import InventarioResumen from '../../components/InventarioResumen/InventarioResumen';

export default function InventarioResumenPage() {
  useEffect(function () { document.title = 'Reportes — Estrucasa'; }, []);

  return (
    <div>
      <InventarioResumen />
    </div>
  );
}
