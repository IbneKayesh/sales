export default function StatListItem({ label, value, sub, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 'var(--sp-3)',
      borderBottom: '1px solid var(--border-light)',
    }}>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{value}</div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>
      </div>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }} />
    </div>
  )
}
