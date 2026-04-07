import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NGL Cuba - Mensajes Anónimos',
  description: 'Plataforma de mensajes anónimos para Cuba',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
