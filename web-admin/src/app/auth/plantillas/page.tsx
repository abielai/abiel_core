export default function PlantillasPage() {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Plantillas</h1>
      <p style={{ color: '#94a3b8' }}>Plantillas de respuesta que alimentan la fase de respuesta del flujo.</p>
      <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18, display: 'grid', gap: 8 }}>
        <p style={{ margin: 0 }}>Bienvenida</p>
        <p style={{ margin: 0 }}>Confirmación de pedido</p>
        <p style={{ margin: 0 }}>Soporte general</p>
      </div>
    </section>
  );
}
