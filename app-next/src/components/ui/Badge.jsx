export default function Badge({ variant = 'default', children, size = 'sm' }) {
  const variants = {
    completed: { bg: '#05966920', color: '#059669' },
    paid: { bg: '#05966920', color: '#059669' },
    received: { bg: '#05966920', color: '#059669' },
    active: { bg: '#05966920', color: '#059669' },
    pending: { bg: '#d9770620', color: '#d97706' },
    processing: { bg: '#3b82f620', color: '#3b82f6' },
    shipped: { bg: '#3b82f620', color: '#3b82f6' },
    cancelled: { bg: '#dc262620', color: '#dc2626' },
    refunded: { bg: '#dc262620', color: '#dc2626' },
    overdue: { bg: '#dc262620', color: '#dc2626' },
    unpaid: { bg: '#dc262620', color: '#dc2626' },
    inactive: { bg: '#6b728020', color: '#6b7280' },
    low: { bg: '#d9770620', color: '#d97706' },
    out: { bg: '#dc262620', color: '#dc2626' },
    default: { bg: '#6b728010', color: '#6b7280' },
  };

  const style = variants[variant] || variants.default;
  const sizes = {
    sm: { padding: '2px 8px', fontSize: '12px' },
    md: { padding: '4px 12px', fontSize: '13px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: sizes[size].padding,
        fontSize: sizes[size].fontSize,
        fontWeight: 500,
        borderRadius: '9999px',
        background: style.bg,
        color: style.color,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: style.color,
        display: 'inline-block',
        flexShrink: 0,
      }} />
      {children}
    </span>
  );
}
