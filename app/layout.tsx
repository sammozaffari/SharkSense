import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SharkSense — Predictive Shark Risk for NSW',
  description: 'Know how sharky it is before you enter the water. Real-time environmental risk assessment for NSW beaches.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
