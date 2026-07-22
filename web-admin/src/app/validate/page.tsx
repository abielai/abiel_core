'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValidatePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Token inválido');
      }

      setStatus('success');
      setMessage('Token validado correctamente');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('abiel_admin_token', token);
        window.location.assign('/auth');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'No se pudo validar');
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, background: '#111827', padding: 24, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
        <h1 style={{ marginTop: 0 }}>Validación de acceso</h1>
        <p style={{ color: '#cbd5e1' }}>Ingresa el token de acceso que te proporcionó el administrador.</p>

        <label htmlFor="token" style={{ display: 'block', marginBottom: 8 }}>Token</label>
        <input
          id="token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="token-..."
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', background: '#020617', color: '#fff', marginBottom: 16 }}
        />

        <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
          {status === 'loading' ? 'Validando...' : 'Validar token'}
        </button>

        {message ? (
          <p style={{ marginTop: 16, color: status === 'error' ? '#fda4af' : '#86efac' }}>{message}</p>
        ) : null}
      </form>
    </main>
  );
}
