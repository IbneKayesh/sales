import notificationsImage from "../../../assets/notifications.png";

const NotificationKit = ({ onClick, unreadCount }) => {
  return (
    <button
      className="task-bar-button"
      aria-label="Notifications"
      onClick={onClick}
    >
      <img
        className="task-bar-button-icon"
        src={notificationsImage}
        alt="notifications"
        height="20"
        width="20"
      />
      {unreadCount > 0 && <span className="task-bar-badge">{unreadCount}</span>}
    </button>
  );
};

export default NotificationKit;
