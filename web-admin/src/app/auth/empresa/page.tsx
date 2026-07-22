export default function EmpresaPage() {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Empresa</h1>
      <p style={{ color: '#94a3b8' }}>Configuración base del tenant y del entorno de mensajería.</p>
      <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18, display: 'grid', gap: 8 }}>
        <p style={{ margin: 0 }}>Nombre: Abiel</p>
        <p style={{ margin: 0 }}>Tenant: tenant-demo</p>
        <p style={{ margin: 0 }}>Estado: activo</p>
        <p style={{ margin: 0 }}>Canal: WhatsApp</p>
      </div>
    </section>
  );
}
