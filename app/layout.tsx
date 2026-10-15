import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PadelClub OS — Tu Club de Pádel',
  description: 'Reserva de pistas, partidos abiertos por niveles y comunidad de tu club.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
