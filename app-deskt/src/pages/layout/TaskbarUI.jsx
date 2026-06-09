import "./TaskbarUI.css";
import StartKit from "./taskbar/StartKit";
import TaskViewKit from "./taskbar/TaskViewKit";
import ClockKit from "./taskbar/ClockKit";
import NotificationKit from "./taskbar/NotificationKit";
import FullScreenKit from "./taskbar/FullScreenKit";
import WindowKit from "./taskbar/WindowKit";
import DesktopKit from "./taskbar/DesktopKit";
import ProfileKit from "./taskbar/ProfileKit";

const TaskbarUI = ({
  onAppSuiteToggle,
  onShowTaskViewFlyout,
  onProfileFlyout,
  onNotificationFlyout,
  notifUnreadCount,
  onShowWindowFlyout,
  onShowDesktop,
  onFullScreen,
  isFullScreen,
  windows = [],
  onRestoreWindow,
}) => {
  return (
    <div className="task-bar-container">
      <div className="task-bar-left">
        <StartKit onClick={onAppSuiteToggle} />
        <TaskViewKit onClick={onShowTaskViewFlyout} />
        <ProfileKit onClick={onProfileFlyout} />
      </div>
      <div className="task-bar-center">
        {windows.map((item) => (
          <button
            key={item.id}
            className={`task-bar-app ${item.isMinimized ? "" : "active"}`}
            onClick={() => onRestoreWindow(item)}
            type="button"
            title={item.name}
          >
            <span className="task-bar-app-icon">
              <img
                src={"../src/assets/icons/" + item.icon}
                alt={item.name}
                height="14"
                width="14"
              />
            </span>
            <span className="task-bar-app-label">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="task-bar-right">
        <NotificationKit
          onClick={onNotificationFlyout}
          unreadCount={notifUnreadCount}
        />
        <WindowKit onClick={onShowWindowFlyout} />
        <DesktopKit onClick={onShowDesktop} />
        <FullScreenKit onClick={onFullScreen} isFullScreen={isFullScreen} />

        <ClockKit />
      </div>
    </div>
  );
};

export default TaskbarUI;
