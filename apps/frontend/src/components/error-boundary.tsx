'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="font-serif text-xl text-foreground">문제가 생겼어요</h2>
              <p className="mt-2 text-sm text-muted-foreground">잠시 후 다시 시도해주세요</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 text-sm text-primary underline-offset-4 hover:underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
