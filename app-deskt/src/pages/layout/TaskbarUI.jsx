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
}) => {
  return (
    <div className="task-bar-container">
      <div className="task-bar-left">
        <StartKit onClick={onAppSuiteToggle} />
        <TaskViewKit onClick={onShowTaskViewFlyout} />
        <ProfileKit onClick={onProfileFlyout} />
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
