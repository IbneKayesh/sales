const UserMenu = ({ isOpen, handleUrlNav }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="lite-popup-menu lite-popup-menu-user">
        <div className="lite-user-circle">
          <div className="lite-avatar">JD</div>

          <div className="lite-user-text">
            <div className="lite-user-name">John Doe</div>

            <div className="lite-user-role">ADMINISTRATOR</div>
          </div>
        </div>
        <div className="lite-user-detail p-2">
          <div className="lite-menu-item-row-bg">
            <div>
              <span className="pi pi-clock mr-2" /> Attendance
            </div>
            <div className="text-xs">Present</div>
          </div>

          <div
            className="lite-menu-item-row"
            onClick={() => handleUrlNav("/profile")}
          >
            <span className="pi pi-user mr-2"></span>
            <span>Profile</span>
          </div>
          <div
            className="lite-menu-item-row"
            onClick={() => handleUrlNav("/settings")}
          >
            <span className="pi pi-cog mr-2"></span>
            <span>Settings</span>
          </div>
          <div
            className="lite-menu-item-row"
            onClick={() => handleUrlNav("/security")}
          >
            <span className="pi pi-shield mr-2"></span>
            <span>Security</span>
          </div>
          <div className="divider-line"></div>
          <div
            className="lite-menu-item-row"
            onClick={() => handleUrlNav("/login")}
          >
            <span className="pi pi-sign-out mr-2"></span>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
