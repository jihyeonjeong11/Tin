import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TinDetailSkeleton } from '@/components/tin-detail-skeleton'

describe('TinDetailSkeleton', () => {
  it('animate-pulse 컨테이너를 렌더링한다', () => {
    const { container } = render(<TinDetailSkeleton />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
