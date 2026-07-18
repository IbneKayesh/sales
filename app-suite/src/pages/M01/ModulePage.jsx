import { useNavigate } from 'react-router-dom'
import PageCard, { PageCardHeader, PageCardTitle, PageCardBody } from '../../components/PageCard'

const modules = [
  { id: 1, name: 'Dashboard', icon: 'fa fa-home', color: '#7c3aed', order_by: 1 },
  { id: 2, name: 'Accounts', icon: 'fa fa-cog', color: '#22c55e', order_by: 2 },
  { id: 3, name: 'Examples', icon: 'fa fa-cog', color: '#f59e0b', order_by: 3 },
]

const menus = [
  { id: 1, name: 'Home', parent_id: 1, icon: 'fa fa-house', url_link: '/' },
  { id: 2, name: 'Reports', parent_id: 1, icon: 'fa fa-chart-bar', url_link: '/reports' },
  { id: 3, name: 'Chart of Accounts', parent_id: 2, icon: 'fa fa-users', url_link: '/M08/chart-of-accounts' },
  { id: 4, name: 'Roles', parent_id: 2, icon: 'fa fa-user-shield', url_link: '/roles' },
  { id: 5, name: 'UI Examples', parent_id: 3, icon: 'fa fa-palette', url_link: '/examples' },
]

// Topbar navigation items — sourced from here so ModulePage is the menu authority
export const navItems = [
  { to: '/', label: 'Dashboard', icon: '◉' },
  { to: '/users', label: 'Users', icon: '◐' },
  { to: '/transactions', label: 'Transactions', icon: '◈' },
  { to: '/reports', label: 'Reports', icon: '▣' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
  { to: '/examples', label: 'Examples', icon: '✦' },
  { to: '/M08/chart-of-accounts', label: 'COA', icon: '◐' },
  { to: '/M01/modules', label: 'Modules', icon: '⊞' },
]

const ModulePage = () => {
  const navigate = useNavigate()

  return (
    <div className="page-wrap">
      <div className="module-page__header">
        <div>
          <h2 className="module-page__title">Modules</h2>
          <p className="module-page__subtitle">
            {modules.length} modules &middot; {menus.length} menus
          </p>
        </div>
      </div>

      <div className="module-page__list">
        {[...modules]
          .sort((a, b) => a.order_by - b.order_by)
          .map((module) => {
            const modMenus = menus.filter((menu) => menu.parent_id === module.id)
            if (modMenus.length === 0) return null

            return (
              <PageCard key={module.id}>
                <PageCardHeader>
                  <div className="module-page__card-header">
                    <div
                      className="module-page__card-icon"
                      style={{ background: `${module.color}18` }}
                    >
                      <i className={module.icon} style={{ fontSize: 18, color: module.color }} />
                    </div>
                    <PageCardTitle
                      title={module.name}
                      subtitle={`${modMenus.length} menu${modMenus.length === 1 ? '' : 's'}`}
                    />
                  </div>
                </PageCardHeader>
                <PageCardBody>
                  <div className="module-page__menu-grid">
                    {modMenus.map((menu) => (
                      <button
                        key={menu.id}
                        type="button"
                        className="module-page__menu-item"
                        onClick={() => navigate(menu.url_link)}
                      >
                        <div
                          className="module-page__menu-icon"
                          style={{ background: `${module.color}18` }}
                        >
                          <i className={menu.icon} style={{ fontSize: 20, color: module.color }} />
                        </div>
                        <span className="module-page__menu-label">{menu.name}</span>
                      </button>
                    ))}
                  </div>
                </PageCardBody>
              </PageCard>
            )
          })}
      </div>
    </div>
  )
}

export default ModulePage