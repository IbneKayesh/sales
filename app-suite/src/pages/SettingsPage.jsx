import { useState } from 'react'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody, PageCardFooter } from '../components/PageCard'
import Button from '../components/Button'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import Dropdown from '../components/Dropdown'
import Checkbox from '../components/Checkbox'
import DataCard, { DataCardGrid } from '../components/DataCard'
import { toast } from '../components/ToastBox'
import { IconSave, IconUsers, IconBell, IconActivity, IconDollar } from '../icons'

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
]

const timezoneOptions = [
  { value: 'utc', label: 'UTC (Coordinated Universal Time)' },
  { value: 'est', label: 'EST (Eastern Standard Time)' },
  { value: 'pst', label: 'PST (Pacific Standard Time)' },
  { value: 'cst', label: 'CST (Central Standard Time)' },
]

const currencyOptions = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'jpy', label: 'JPY (¥)' },
]

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Ibne Kayesh',
    email: 'kayesh@example.com',
    company: 'AppSuite Inc.',
    phone: '+1-555-0123',
  })
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('utc')
  const [currency, setCurrency] = useState('usd')
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
    smsAlerts: false,
  })

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="page-wrap">
      {/* Overview Stats */}
      <DataCardGrid cols={4}>
        <DataCard variant="secondary" icon={<IconUsers size={22} />} value="Admin" label="User Role" badge="Active" />
        <DataCard variant="success" icon={<IconBell size={22} />} value="3" label="Active Alerts" badge="Enabled" />
        <DataCard variant="warning" icon={<IconActivity size={22} />} value="99.9%" label="System Status" badge="Healthy" />
        <DataCard variant="accent" icon={<IconDollar size={22} />} value="USD" label="Currency" badge={currency.toUpperCase()} />
      </DataCardGrid>

      {/* Profile Settings */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Profile Settings"
            subtitle="Manage your account information and personal details"
          />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-6">
              <InputText
                label="Full Name"
                placeholder="Enter your name"
                value={profile.name}
                name="name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6">
              <InputText
                label="Email"
                placeholder="Enter your email"
                value={profile.email}
                name="email"
                onChange={handleChange}
                type="email"
                required
              />
            </div>
            <div className="col-span-6">
              <InputText
                label="Company"
                placeholder="Enter company name"
                value={profile.company}
                name="company"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-6">
              <InputText
                label="Phone"
                placeholder="Enter phone number"
                value={profile.phone}
                name="phone"
                onChange={handleChange}
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* Preferences */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Preferences"
            subtitle="Language, timezone, and display settings"
          />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid">
            <div className="col-span-4">
              <Dropdown
                label="Language"
                options={languageOptions}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                searchable
              />
            </div>
            <div className="col-span-4">
              <Dropdown
                label="Timezone"
                options={timezoneOptions}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                searchable
              />
            </div>
            <div className="col-span-4">
              <Dropdown
                label="Currency"
                options={currencyOptions}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* Notifications */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Notifications"
            subtitle="Configure how you receive alerts and updates"
          />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <Checkbox
              label="Email alerts for critical system events"
              checked={notifications.emailAlerts}
              onChange={() => toggleNotif('emailAlerts')}
            />
            <Checkbox
              label="Push notifications for important updates"
              checked={notifications.pushNotifications}
              onChange={() => toggleNotif('pushNotifications')}
            />
            <Checkbox
              label="Weekly digest email with summary report"
              checked={notifications.weeklyDigest}
              onChange={() => toggleNotif('weeklyDigest')}
            />
            <Checkbox
              label="SMS alerts for system outages"
              checked={notifications.smsAlerts}
              onChange={() => toggleNotif('smsAlerts')}
            />
          </div>
        </PageCardBody>
        <PageCardFooter>
          <Button variant="primary" onClick={handleSave}>
            <IconSave size={16} className="icon-left" />
            Save Settings
          </Button>
        </PageCardFooter>
      </PageCard>
    </div>
  )
}
