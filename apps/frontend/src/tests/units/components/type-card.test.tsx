import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TypeCard } from '@/components/type-card'
import { Archive } from 'lucide-react'

describe('TypeCard', () => {
  const defaultProps = {
    type: 'letting_go' as const,
    label: '놓아버림',
    sub: '버리기로 한 것',
    icon: Archive,
    selected: false,
    onSelect: vi.fn(),
  }

  it('label과 sub 텍스트를 렌더링한다', () => {
    render(<TypeCard {...defaultProps} />)
    expect(screen.getByText('놓아버림')).toBeInTheDocument()
    expect(screen.getByText('버리기로 한 것')).toBeInTheDocument()
  })

  it('클릭하면 onSelect를 type과 함께 호출한다', () => {
    const onSelect = vi.fn()
    render(<TypeCard {...defaultProps} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith('letting_go')
  })

  it('selected=true이면 border-primary 클래스를 가진다', () => {
    render(<TypeCard {...defaultProps} selected={true} />)
    expect(screen.getByRole('button')).toHaveClass('border-primary')
  })

  it('selected=false이면 border-border 클래스를 가진다', () => {
    render(<TypeCard {...defaultProps} selected={false} />)
    expect(screen.getByRole('button')).toHaveClass('border-border')
  })
})
