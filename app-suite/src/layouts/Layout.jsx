import Topbar from './Topbar'

export default function Layout({ children, className = '', ...rest }) {
  return (
    <div className={`layout${className ? ' ' + className : ''}`} {...rest}>
      <Topbar />
      {/* Bottom padding clears the fixed merged taskbar/status bar (~36px)
          so page content never hides behind it. */}
      <main
        className="layout__main"
        style={{ paddingBottom: 'calc(var(--sp-8) + 36px)' }}
      >
        {children}
      </main>
    </div>
  )
}