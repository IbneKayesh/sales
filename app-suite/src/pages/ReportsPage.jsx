import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '../components/PageCard'
import Button from '../components/Button'

export default function ReportsPage() {
  return (
    <div className="home-page">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Reports & Analytics"
            subtitle="Generate and view business intelligence reports"
          />
          <PageCardActions>
            <Button size="md" variant="outline">Schedule</Button>
            <Button size="sm">Generate Report</Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <p style={{ color: 'var(--text)', lineHeight: 1.6 }}>
            Reports module is ready for implementation.
            This section will provide customizable dashboards,
            scheduled report generation, and data export capabilities
            in PDF, Excel, and CSV formats.
          </p>
        </PageCardBody>
      </PageCard>
    </div>
  )
}
