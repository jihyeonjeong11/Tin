import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TinCard } from '@/components/tin-card'
import type { TinResponse } from '@tin/shared'

const base: TinResponse = {
  id: 'abc-123',
  userId: 'user-1',
  title: '개발 공부 포기',
  givenUpAt: '2026-01-15',
  feeling: null,
  type: 'letting_go',
  createdAt: '2026-01-15T00:00:00.000Z',
  updatedAt: '2026-01-15T00:00:00.000Z',
}

describe('TinCard', () => {
  it('제목을 렌더링한다', () => {
    render(<TinCard tin={base} />)
    expect(screen.getByText('개발 공부 포기')).toBeInTheDocument()
  })

  it('상세 페이지 링크를 가진다', () => {
    render(<TinCard tin={base} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/home/abc-123')
  })

  it('feeling이 있으면 표시한다', () => {
    render(<TinCard tin={{ ...base, feeling: '힘들었지만 의미 있었다' }} />)
    expect(screen.getByText('힘들었지만 의미 있었다')).toBeInTheDocument()
  })

  it('feeling이 null이면 표시하지 않는다', () => {
    render(<TinCard tin={base} />)
    expect(screen.queryByText('힘들었지만 의미 있었다')).not.toBeInTheDocument()
  })

  it('letting_go 타입이면 Archive 아이콘을 렌더링한다', () => {
    const { container } = render(<TinCard tin={{ ...base, type: 'letting_go' }} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('reflection 타입이면 Feather 아이콘을 렌더링한다', () => {
    const { container } = render(<TinCard tin={{ ...base, type: 'reflection' }} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
