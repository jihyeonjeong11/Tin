import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TypeBadge } from '@/components/type-badge'

describe('TypeBadge', () => {
  it('letting_go 타입이면 "놓아버림"을 표시한다', () => {
    render(<TypeBadge type="letting_go" />)
    expect(screen.getByText('놓아버림')).toBeInTheDocument()
  })

  it('reflection 타입이면 "돌아봄"을 표시한다', () => {
    render(<TypeBadge type="reflection" />)
    expect(screen.getByText('돌아봄')).toBeInTheDocument()
  })
})
