import { Component } from 'react'
import Button from './Button'
import { IconClose } from '../icons'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, retry: this.handleRetry })
          : this.props.fallback
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary__icon">
            <IconClose size={28} />
          </div>
          <h3 className="error-boundary__title">
            {this.props.title || 'Something went wrong'}
          </h3>
          <p className="error-boundary__message">
            {this.props.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {this.props.showRetry !== false && (
            <Button variant="primary" size="sm" onClick={this.handleRetry}>
              Try again
            </Button>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
