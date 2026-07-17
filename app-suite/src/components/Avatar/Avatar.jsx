
import './Avatar.css';
const Avatar = ({ src, alt = 'User Avatar', size = 'medium', className = '' }) => {
  const sizeClass = size || 'medium';
  
  return (
    <div className={`avatarContainer ${sizeClass} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="avatarImg" />
      ) : (
        <span className="initials">{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;
