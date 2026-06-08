import "./ProfileFlyout.css";

const ProfileFlyout = () => {
  return (
    <div className="profile-flyout">
      <div className="profile-flyout-header">
        <div className="profile-flyout-avatar">👤</div>
        <div className="profile-flyout-info">
          <div className="profile-flyout-name">User Name</div>
          <div className="profile-flyout-mail">user@example.com</div>
        </div>
      </div>
      <div className="profile-flyout-list">
        <button className="profile-flyout-list-item">Settings</button>
        <button className="profile-flyout-list-item">Sign out</button>
      </div>
    </div>
  );
};

export default ProfileFlyout;
