'use client'

import { authClient } from '@/lib/auth-client'

export default function TestPage() {
  const { data: session, isPending, error } = authClient.useSession()

  return (
    <div
      style={{
        fontFamily: 'monospace',
        padding: '2rem',
        background: '#0f0f0f',
        minHeight: '100vh',
        color: '#e5e5e5',
      }}
    >
      <h1 style={{ marginBottom: '1.5rem' }}>🧪 Auth Test</h1>

      <Section title="useSession">
        <Row label="isPending" value={String(isPending)} />
        <Row label="error" value={error ? JSON.stringify(error) : 'null'} />
        <Row label="session" value={session ? JSON.stringify(session, null, 2) : 'null'} pre />
      </Section>

      <Section title="document.cookie">
        <pre style={{ color: '#4ade80', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {typeof document !== 'undefined' ? document.cookie || '(empty)' : '(SSR)'}
        </pre>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: '2rem',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1rem',
      }}
    >
      <h2
        style={{
          color: '#888',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

function Row({ label, value, pre }: { label: string; value: string; pre?: boolean }) {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <span style={{ color: '#888' }}>{label}: </span>
      {pre ? (
        <pre
          style={{ color: '#4ade80', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}
        >
          {value}
        </pre>
      ) : (
        <span style={{ color: '#4ade80' }}>{value}</span>
      )}
    </div>
  )
}
