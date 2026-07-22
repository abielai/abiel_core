export default function AIPage() {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>AI</h1>
      <p style={{ color: '#94a3b8' }}>Configuración del modelo, reglas de decisión y salida del flujo de IA.</p>
      <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', border: '1px solid #334155', borderRadius: 16, padding: 18, display: 'grid', gap: 8 }}>
        <p style={{ margin: 0 }}>Modelo activo: GPT</p>
        <p style={{ margin: 0 }}>Modo: respuesta asistida</p>
        <p style={{ margin: 0 }}>Decisión: pending</p>
      </div>
    </section>
  );
}
