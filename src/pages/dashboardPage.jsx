import { useEffect } from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';

export default function DashboardPage() {
  useEffect(function () { document.title = 'Dashboard — Estrucasa'; }, []);

  return (
    <div>
      <Dashboard />
    </div>
  );
}
