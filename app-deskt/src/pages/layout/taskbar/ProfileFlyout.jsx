import "./ProfileFlyout.css";

const ProfileFlyout = ({ onOpenProfile, onSignOut }) => {
  return (
    <div className="profile-flyout">
      <div className="profile-flyout-header">
        <div className="profile-flyout-avatar">A</div>
        <div className="profile-flyout-info">
          <div className="profile-flyout-name">Administrator</div>
          <div className="profile-flyout-mail">admin@erp-system.local</div>
        </div>
      </div>
      <div className="profile-flyout-list">
        <button
          className="profile-flyout-list-item"
          type="button"
          onClick={onOpenProfile}
        >
          Profile settings
        </button>
        <button
          className="profile-flyout-list-item danger"
          type="button"
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default ProfileFlyout;
