import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TinListSkeleton } from '@/components/tin-list-skeleton'

describe('TinListSkeleton', () => {
  it('3개의 스켈레톤 아이템을 렌더링한다', () => {
    const { container } = render(<TinListSkeleton />)
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3)
  })
})
