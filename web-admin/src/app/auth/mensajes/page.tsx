export default function MensajesPage() {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Mensajes</h1>
      <p style={{ color: '#94a3b8' }}>Vista del flujo de ingestión y salida del canal WhatsApp.</p>
      <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18, display: 'grid', gap: 8 }}>
        <p style={{ margin: 0 }}>Entrada: hola</p>
        <p style={{ margin: 0 }}>Estado: processed</p>
        <p style={{ margin: 0 }}>Respuesta: enviada al canal</p>
      </div>
    </section>
  );
}
