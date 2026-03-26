'use client'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { api } from '@/lib/api'

function HealthCheck() {
  useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then((r) => r.data),
    staleTime: Infinity,
    retry: false,
  })
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <HealthCheck />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
