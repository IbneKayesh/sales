import "./NotificationsBtn.css";
import notificationsImage from "../../../assets/notifications.png";

const NotificationsBtn = ({ unreadCount, onToggleClick }) => {
  return (
    <>
      <button
        className="notif-bell-btn"
        onClick={onToggleClick}
        title="System Notifications"
      >
        <img
          src={notificationsImage}
          alt="System Notifications"
          width="24"
          height="24"
          style={{ color: "var(--accent-light)" }}
        />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>
    </>
  );
};
export default NotificationsBtn;
