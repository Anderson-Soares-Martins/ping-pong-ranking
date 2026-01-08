import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ranking de Ping Pong',
  description: 'Sistema de ranking com algoritmo Elo Rating',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
