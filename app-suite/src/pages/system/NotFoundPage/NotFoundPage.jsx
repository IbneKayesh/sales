import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.graphic}>
        <span className={styles.code}>404</span>
      </div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className={styles.actions}>
        <button className={styles.homeBtn} onClick={() => navigate('/home')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go Home
        </button>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
