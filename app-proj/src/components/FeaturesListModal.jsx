import { useEffect } from 'react';

export default function FeaturesListModal({
  title,
  features,
  onClose
}) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const unique = Array.from(
    new Map((features || []).map(f => [f.feature_id ?? f.id ?? f.feature_name, f])).values()
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          background: 'var(--card-bg, #fff)',
          color: 'var(--text-primary, #1e293b)',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: '12px',
          width: 'min(720px, 92vw)',
          maxHeight: '82vh',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--border, #e2e8f0)',
            background: 'var(--panel-bg, #f0f4f9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 13 }}>{title}</div>
          <button className="btn btn-secondary btn-xs" onClick={onClose}>Close</button>
        </div>

        <div style={{ padding: '12px 14px 14px', overflow: 'auto' }}>
          {unique.length === 0 ? (
            <div style={{ opacity: 0.8 }}>No features found.</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {unique
                .sort((a, b) => String(a.feature_name || '').localeCompare(String(b.feature_name || '')))
                .map((f) => (
                  <div
                    key={f.feature_id ?? f.id ?? f.feature_name}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--border, #e2e8f0)',
                      background: 'rgba(14,165,233,0.04)'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12, opacity: 0.9 }}>
                      {(f.module_name || '-')} / {(f.submodule_name || '-')}
                    </div>
                    <div style={{ fontWeight: 800, marginTop: 2 }}>{f.feature_name || '-'}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

