type Props = { title: string; userName: string; onLogout: () => void }

export function TopBar({ title, userName, onLogout }: Props) {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-sub">Professional accounting workflow with mock data</p>
      </div>
      <div className="topbar-actions">
        <span className="chip">{userName}</span>
        <button className="icon-logout" onClick={onLogout} title="Logout" aria-label="Logout">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M10 17v-2h4V9h-4V7h6v10zm-7 4q-.825 0-1.413-.588T1 19V5q0-.825.588-1.412T3 3h9v2H3v14h9v2zm14.175-6H8v-2h9.175l-2.588-2.588L16 9l5 5l-5 5l-1.413-1.413z" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  )
}
