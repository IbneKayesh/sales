import { useLocation } from 'react-router-dom';

/**
 * Wraps page content with an Android-style app-open animation.
 * Each route change triggers a scale+fade entrance from the sidebar direction.
 * The previous page instantly gives way — like tapping an Android app icon.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div className="page-transition-container page-enter" key={location.pathname}>
      {children}
    </div>
  );
}
