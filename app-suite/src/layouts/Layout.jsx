import Topbar from './Topbar'
import './Layout.css'

export default function Layout({ children, className = '', ...rest }) {
  return (
    <div className={`layout${className ? ' ' + className : ''}`} {...rest}>
      <Topbar />
      {/* Bottom padding clears the fixed merged taskbar/status bar (~36px)
          so page content never hides behind it — see Layout.css. */}
      <main className="layout__main layout__main--taskbar-clear">
        {children}
      </main>
    </div>
  )
}