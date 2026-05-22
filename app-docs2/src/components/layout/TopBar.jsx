export default function TopBar({ active, onChange }) {
  return (
    <div className="topbar">
      <button
        type="button"
        className={`topbar__item ${active === 'features' ? 'is-active' : ''}`}
        onClick={() => onChange('features')}
      >
        Features
      </button>
      <button
        type="button"
        className={`topbar__item ${active === 'tables' ? 'is-active' : ''}`}
        onClick={() => onChange('tables')}
      >
        Tables
      </button>
    </div>
  );
}

