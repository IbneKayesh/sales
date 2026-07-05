import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-container" style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>⚠️</div>
          <h2>Something went wrong</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
            Please refresh the page or go back and try again.
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{ marginTop: "12px", maxWidth: "200px", margin: "12px auto 0" }}
            onClick={() => window.location.href/"login"}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
