import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { IconError } from '../icons'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="page-wrap" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: 'var(--sp-6)',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: '20px',
        background: 'var(--primary-bg)',
        color: 'var(--primary)',
      }}>
        <IconError size={36} />
      </div>

      <h1 style={{
        fontSize: 'clamp(4rem, 10vw, 6rem)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-primary)',
        lineHeight: 1,
        margin: 0,
        letterSpacing: '-0.05em',
      }}>
        404
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-2)',
        maxWidth: 400,
      }}>
        <p style={{
          fontSize: 'var(--fs-lg)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          Page not found
        </p>
        <p style={{
          fontSize: 'var(--fs-base)',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 'var(--lh-normal)',
        }}>
          The page you're looking for doesn't exist or has been moved.
          Check the URL or head back to the dashboard.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  )
}
