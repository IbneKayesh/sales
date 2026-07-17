import Topbar from './Topbar'

export default function Layout({ children, className = '', ...rest }) {
  return (
    <div className={`layout${className ? ' ' + className : ''}`} {...rest}>
      <Topbar />
      <main className="layout__main">
        {children}
      </main>
    </div>
  )
}