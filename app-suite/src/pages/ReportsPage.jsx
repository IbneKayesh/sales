import { useState } from 'react'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '../components/PageCard'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import InputCalendar from '../components/InputCalendar'
import DataTable from '../components/DataTable'
import DataCard, { DataCardGrid } from '../components/DataCard'
import { toast } from '../components/ToastBox'
import { IconDollar, IconActivity, IconBox, IconDownload, IconUsers, IconCheck, IconClose } from '../icons'
import Badge from '../components/Badge'

const reportTypeOptions = [
  { value: 'revenue', label: 'Revenue Report' },
  { value: 'expenses', label: 'Expenses Report' },
  { value: 'users', label: 'User Activity' },
  { value: 'performance', label: 'Performance' },
]

const periodOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last quarter' },
  { value: '1y', label: 'Year to date' },
]

const reportColumns = [
  { key: 'metric', header: 'Metric', width: '200px' },
  { key: 'value', header: 'Value', width: '150px' },
  { key: 'change', header: 'Change', width: '120px' },
  {
    key: 'trend',
    header: 'Trend',
    width: '100px',
    render: (v) => <Badge variant={v === 'up' ? 'success' : 'danger'} icon={v === 'up' ? <IconCheck size={12} /> : <IconClose size={12} />}>{v === 'up' ? 'Up' : 'Down'}</Badge>,
  },
]

const reportData = [
  { id: 1, metric: 'Monthly Revenue', value: '$48,290', change: '+8.2%', trend: 'up' },
  { id: 2, metric: 'Monthly Expenses', value: '$32,150', change: '-3.1%', trend: 'down' },
  { id: 3, metric: 'Net Profit', value: '$16,140', change: '+12.4%', trend: 'up' },
  { id: 4, metric: 'Active Users', value: '1,284', change: '+5.7%', trend: 'up' },
  { id: 5, metric: 'Avg Response Time', value: '1.2s', change: '-0.3s', trend: 'up' },
  { id: 6, metric: 'Support Tickets', value: '47', change: '+12%', trend: 'down' },
]

export default function ReportsPage() {
  const [reportType, setReportType] = useState('revenue')
  const [period, setPeriod] = useState('30d')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleGenerate = () => {
    toast.success(`Generating ${reportTypeOptions.find(o => o.value === reportType)?.label}...`)
  }

  const handleExport = () => {
    toast.success('Report exported successfully!')
  }

  return (
    <div className="page-wrap">
      {/* Summary Cards */}
      <DataCardGrid cols={4}>
        <DataCard variant="success" icon={<IconDollar size={22} />} value="$48,290" label="Revenue" badge="+8.2%" trend="up" />
        <DataCard variant="danger" icon={<IconBox size={22} />} value="$32,150" label="Expenses" badge="-3.1%" trend="down" />
        <DataCard variant="accent" icon={<IconActivity size={22} />} value="97.8%" label="Uptime" badge="+0.4%" trend="up" />
        <DataCard variant="secondary" icon={<IconUsers size={22} />} value="1,284" label="Active Users" badge="+5.7%" trend="up" />
      </DataCardGrid>

      {/* Report Generator */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Report Generator"
            subtitle="Select parameters and generate custom business reports"
          />
          <PageCardActions>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <IconDownload size={14} className="icon-left" />
              Export
            </Button>
            <Button size="sm" onClick={handleGenerate}>Generate Report</Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-3">
              <Dropdown
                label="Report Type"
                options={reportTypeOptions}
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                searchable
              />
            </div>
            <div className="col-span-3">
              <Dropdown
                label="Period"
                options={periodOptions}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <InputCalendar label="Start Date" value={startDate} name="startDate" onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="col-span-3">
              <InputCalendar label="End Date" value={endDate} name="endDate" onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* Results Table */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Report Results"
            subtitle="Key metrics and performance indicators"
          />
        </PageCardHeader>
        <PageCardBody>
          <DataTable
            columns={reportColumns}
            data={reportData}
            pageSize={6}
            sortable
            searchable
            striped
            hoverable
            exportable
            exportFilename="report-results.csv"
            emptyMessage="No report data available"
          />
        </PageCardBody>
      </PageCard>
    </div>
  )
}
