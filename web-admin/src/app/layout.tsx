import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Abiel Admin',
  description: 'Autenticación segura para web admin'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#0f172a', color: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
