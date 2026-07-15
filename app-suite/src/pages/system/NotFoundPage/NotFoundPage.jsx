import { useNavigate } from 'react-router-dom';
import { IconHomeArrow, IconChevronLeft } from '@/assets/icons';
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
          <IconHomeArrow width="16" height="16" />
          Go Home
        </button>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <IconChevronLeft width="16" height="16" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
