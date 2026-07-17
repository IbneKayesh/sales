import { useNavigate } from 'react-router-dom';
import { IconHomeArrow, IconChevronLeft } from '@/assets/icons';
import './NotFoundPage.css';
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="graphic">
        <span className="code">404</span>
      </div>
      <h1 className="title">Page Not Found</h1>
      <p className="description">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="actions">
        <button className="homeBtn" onClick={() => navigate('/home')}>
          <IconHomeArrow width="16" height="16" />
          Go Home
        </button>
        <button className="backBtn" onClick={() => navigate(-1)}>
          <IconChevronLeft width="16" height="16" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
