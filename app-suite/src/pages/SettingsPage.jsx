import PageCard, { PageCardHeader, PageCardTitle, PageCardBody } from '../components/PageCard'

export default function SettingsPage() {
  return (
    <div className="home-page">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="System Settings"
            subtitle="Configure ERP system preferences and global settings"
          />
        </PageCardHeader>
        <PageCardBody>
          <p style={{ color: 'var(--text)', lineHeight: 1.6 }}>
            System settings module is ready for implementation.
            Configure application preferences, notification rules,
            audit logging, and system-wide defaults.
          </p>
        </PageCardBody>
      </PageCard>
    </div>
  )
}
