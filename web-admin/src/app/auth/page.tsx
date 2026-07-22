'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tenantSnapshot, workflowSteps } from '../lib/architectureData';

export default function AuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Verificando sesión...');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = sessionStorage.getItem('abiel_admin_token');

    if (!token) {
      setStatus('No hay sesión activa. Vuelve a validar tu token.');
      router.replace('/validate');
      return;
    }

    setStatus('Sesión activa. Token cargado correctamente.');
  }, [router]);

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0 }}>Centro de operaciones</h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0' }}>Vista operativa del flujo de mensajería y control del tenant.</p>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 999, background: '#1e293b', color: '#86efac', fontSize: 13, border: '1px solid #334155' }}>{status}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18 }}>
          <div style={{ color: '#60a5fa', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Tenant</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{tenantSnapshot.tenantId}</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 14 }}>Empresa: {tenantSnapshot.companyId}</p>
          <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 14 }}>Estado: {tenantSnapshot.companyStatus}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18 }}>
          <div style={{ color: '#34d399', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Permisos</div>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14 }}>{tenantSnapshot.permissions.join(', ')}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18 }}>
          <div style={{ color: '#f59e0b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Trazabilidad</div>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: 14 }}>Trace ID: {tenantSnapshot.traceId}</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Flujo de negocio</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {workflowSteps.map((step) => (
            <div key={step.title} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{step.title}</strong>
                <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>{step.description}</div>
              </div>
              <span style={{ color: '#86efac', fontSize: 13, background: '#1f2937', padding: '6px 10px', borderRadius: 999 }}>{step.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
