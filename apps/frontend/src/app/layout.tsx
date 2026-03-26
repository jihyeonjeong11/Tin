import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { ErrorBoundary } from '@/components/error-boundary'
import { Inter, Lora } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: { default: 'Tin', template: '%s | Tin' },
  description: '잊었던 것, 버렸던 것에 대한 기록',
  openGraph: {
    title: 'Tin',
    description: '잊었던 것, 버렸던 것에 대한 기록',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: 'Tin',
    description: '잊었던 것, 버렸던 것에 대한 기록',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn(inter.variable, lora.variable)}>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
