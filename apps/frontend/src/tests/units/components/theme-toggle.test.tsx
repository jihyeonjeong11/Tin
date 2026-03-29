import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/theme-toggle'

const mockSetTheme = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mockSetTheme }),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('테마 전환 버튼이 렌더링된다', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: '테마 전환' })).toBeInTheDocument()
  })

  it('light 테마일 때 클릭하면 dark로 전환한다', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: '테마 전환' }))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
