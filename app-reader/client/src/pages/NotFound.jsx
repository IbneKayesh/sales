import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <EmptyState
        icon={Compass}
        title="This page does not exist"
        description="The link may be outdated, or the research item was removed."
        action={
          <Link to="/" className="btn btn-primary">
            Back to dashboard
          </Link>
        }
      />
    </div>
  )
}
