import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from '@/components/form-field'

describe('FormField', () => {
  it('label과 children을 렌더링한다', () => {
    render(
      <FormField htmlFor="email" label="이메일">
        <input id="email" />
      </FormField>,
    )
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('label이 htmlFor와 연결된다', () => {
    render(
      <FormField htmlFor="email" label="이메일">
        <input id="email" />
      </FormField>,
    )
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
  })

  it('error가 있으면 에러 메시지를 표시한다', () => {
    render(
      <FormField htmlFor="email" label="이메일" error="올바른 이메일을 입력해주세요">
        <input id="email" />
      </FormField>,
    )
    expect(screen.getByText('올바른 이메일을 입력해주세요')).toBeInTheDocument()
  })

  it('error가 없으면 에러 메시지를 표시하지 않는다', () => {
    render(
      <FormField htmlFor="email" label="이메일">
        <input id="email" />
      </FormField>,
    )
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })
})
