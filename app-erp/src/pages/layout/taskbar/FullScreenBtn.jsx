import "./FullScreenBtn.css";
import fullscreenImage from "../../../assets/full-screen.png";
import normalscreenImage from "../../../assets/normal-screen.png";

const FullScreenBtn = ({ isFullScreen, onToggleClick }) => {
  return (
    <button
      title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      onClick={onToggleClick}
      className="fullscreen-toggle-btn hide-small-screen"
    >
      {/* <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isFullScreen ? (
          <path d="M4 14h6v6m0-6L3 21m17-7h-6v6m0-6l7 7M4 10h6V4m0 6L3 3m17 7h-6V4m0 6l7-7" />
        ) : (
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        )}
      </svg> */}

      {isFullScreen ? (
        <img
          src={normalscreenImage}
          alt="System Notifications"
          width="24"
          height="24"
          style={{ color: "var(--accent-light)" }}
        />
      ) : (
        <img
          src={fullscreenImage}
          alt="System Notifications"
          width="24"
          height="24"
          style={{ color: "var(--accent-light)" }}
        />
      )}
    </button>
  );
};
export default FullScreenBtn;
