import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Espadel Club — Aplicación Oficial del Club',
  description: 'Reserva de pistas, partidos abiertos equilibrados por niveles y comunidad de socios de Espadel Club.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full dark">
      <body className="min-h-full flex flex-col bg-black text-zinc-100 selection:bg-yellow-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
