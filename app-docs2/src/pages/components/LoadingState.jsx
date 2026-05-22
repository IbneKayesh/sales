export default function LoadingState({ text = 'Work in progress, please wait...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12 }}>
      <span className="spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

