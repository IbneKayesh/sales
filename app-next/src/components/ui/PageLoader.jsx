export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-container">
        <div className="loader-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <path d="M6 6h.01M6 18h.01" />
          </svg>
        </div>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" />
        </div>
        <span className="loader-text">Loading...</span>
      </div>
    </div>
  );
}
