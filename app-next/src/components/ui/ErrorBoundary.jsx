import { Component, useState } from 'react';

const initialState = { hasError: false, error: null };

/**
 * Wraps a child inside an ErrorBoundary with a retry mechanism.
 * When the error boundary's onRetry fires, the wrapper key changes,
 * forcing React to unmount and remount the lazy component — this
 * causes React.lazy to call the import() function again, which is
 * the only way to recover from chunk-load failures.
 */
export function RetryableBoundary({ children, onError }) {
  const [key, setKey] = useState(0);
  return (
    <ErrorBoundary
      onRetry={() => setKey(k => k + 1)}
      onError={onError}
    >
      <div key={key}>{children}</div>
    </ErrorBoundary>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log the error to console in development for debugging
    if (import.meta.env.DEV) {
      console.group('🔴 Page crashed');
      console.error(error);
      console.info('Component stack:', info.componentStack);
      console.groupEnd();
    }
    // Report to monitoring service in production (placeholder)
    const onError = this.props.onError;
    if (onError) onError(error, info);
  }

  handleRetry = () => {
    this.setState(initialState);
    // Also invalidate the lazy module cache so React.lazy re-fetches the chunk
    if (this.props.onRetry) this.props.onRetry();
  };

  render() {
    if (this.state.hasError) {
      // Allow custom fallback override
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          retry: this.handleRetry,
        });
      }

      const error = this.state.error;
      const isChunkError =
        error && (error.message?.includes('chunk') ||
                  error.message?.includes('Loading') ||
                  error.name === 'ChunkLoadError');

      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">
              {isChunkError ? (
                /* Network / offline icon */
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              ) : (
                /* Bug / crash icon */
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>

            <h2 className="error-boundary-title">
              {isChunkError ? 'Failed to load page' : 'Something went wrong'}
            </h2>

            <p className="error-boundary-message">
              {isChunkError
                ? 'The page could not be loaded. This may be due to a network issue or a new deployment.'
                : 'An unexpected error occurred while rendering this page.'}
            </p>

            {import.meta.env.DEV && error && (
              <details className="error-boundary-details">
                <summary>Error details (dev only)</summary>
                <pre>{error.message}{error.stack ? '\n' + error.stack : ''}</pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button className="btn btn-primary" onClick={this.handleRetry}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Try Again
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
