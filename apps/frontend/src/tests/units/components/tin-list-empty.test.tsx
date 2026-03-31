import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TinListEmpty } from '@/components/tin-list-empty'

describe('TinListEmpty', () => {
  it('letting_go 탭에서 올바른 텍스트를 표시한다', () => {
    render(<TinListEmpty tab="letting_go" />)
    expect(screen.getByText('비어있어요')).toBeInTheDocument()
    expect(screen.getByText('흘려보낸 것들이 여기 쌓입니다.')).toBeInTheDocument()
  })

  it('reflection 탭에서 올바른 텍스트를 표시한다', () => {
    render(<TinListEmpty tab="reflection" />)
    expect(screen.getByText('비어있어요')).toBeInTheDocument()
    expect(screen.getByText('아쉬운 것들에 대해 기록합니다.')).toBeInTheDocument()
  })

  it('새 Tin 만들기 링크를 가진다', () => {
    render(<TinListEmpty tab="letting_go" />)
    expect(screen.getByRole('link', { name: '새 Tin 만들기' })).toHaveAttribute('href', '/home/new')
  })
})
