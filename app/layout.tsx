import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Legality - AI-Powered Legal Guidance',
  description: 'Get instant legal guidance by finding similar cases and connecting with qualified lawyers.',
  keywords: ['legal', 'law', 'attorney', 'lawyer', 'legal advice', 'legal guidance', 'case lookup'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
