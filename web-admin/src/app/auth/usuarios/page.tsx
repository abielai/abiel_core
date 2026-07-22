export default function UsuariosPage() {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Usuarios</h1>
      <p style={{ color: '#94a3b8' }}>Usuarios del tenant con roles y permisos asociados al flujo.</p>
      <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18, display: 'grid', gap: 8 }}>
        <p style={{ margin: 0 }}>Admin principal — superadmin</p>
        <p style={{ margin: 0 }}>Operador — agent</p>
        <p style={{ margin: 0 }}>Soporte — support</p>
      </div>
    </section>
  );
}
