'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/auth', label: 'Inicio', description: 'Resumen operativo' },
  { href: '/auth/empresa', label: 'Empresa', description: 'Tenant y configuración' },
  { href: '/auth/usuarios', label: 'Usuarios', description: 'Roles y permisos' },
  { href: '/auth/mensajes', label: 'Mensajes', description: 'Flujo de conversación' },
  { href: '/auth/plantillas', label: 'Plantillas', description: 'Respuestas base' },
  { href: '/auth/pront', label: 'Pront', description: 'Contexto y prompts' },
  { href: '/auth/ai', label: 'AI', description: 'Modelo y decisiones' }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = sessionStorage.getItem('abiel_admin_token');
    if (!token) {
      router.replace('/validate');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', color: '#f8fafc', display: 'flex' }}>
      <aside style={{ width: 280, borderRight: '1px solid #1f2937', padding: '24px 18px', background: 'rgba(15, 23, 42, 0.95)' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, background: '#2563eb', fontWeight: 700 }}>A</div>
          <h2 style={{ margin: '12px 0 6px', fontSize: 20 }}>Abiel Admin</h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Operación SaaS de mensajería</p>
        </div>

        <nav style={{ display: 'grid', gap: 8 }}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none', color: active ? '#fff' : '#94a3b8', background: active ? 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent', padding: '12px 12px', borderRadius: 10, border: active ? '1px solid #3b82f6' : '1px solid transparent' }}>
                <div style={{ fontWeight: 600 }}>{link.label}</div>
                <div style={{ fontSize: 12, color: active ? '#dbeafe' : '#64748b', marginTop: 2 }}>{link.description}</div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 28 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
