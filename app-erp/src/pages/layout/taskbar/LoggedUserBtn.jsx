const LoggedUserBtn = ({ avatarText, userName, onToggleClick }) => {
  return (
    <button
      className="profile-avatar-btn"
      onClick={onToggleClick}
      title={`Profile: ${userName}`}
    >
      {avatarText || userName.slice(0, 2).toUpperCase()}
    </button>
  );
};
export default LoggedUserBtn;