import { Link, useLocation } from 'react-router-dom';
import { pageTitles } from '../../config/routes';

export default function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  // Don't show breadcrumbs on the root/home page
  if (pathname === '/' || pathname === '/login') return null;

  // Split path into segments and build breadcrumb trail
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Always start with Home (never the last crumb since we return null on '/')
  breadcrumbs.push({
    label: pageTitles['/'] || 'Home',
    path: '/',
    isLast: false,
  });

  // Build up each segment
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Generate a human-readable label
    let label = pageTitles[currentPath];
    if (!label) {
      // Auto-format: 'sales-management' -> 'Sales Management'
      label = segment
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    breadcrumbs.push({ label, path: currentPath, isLast });
  });

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, i) => (
          <li key={crumb.path} className="breadcrumb-item">
            {i > 0 && (
              <svg className="breadcrumb-sep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            {crumb.isLast ? (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-link">
                {i === 0 && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                )}
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
