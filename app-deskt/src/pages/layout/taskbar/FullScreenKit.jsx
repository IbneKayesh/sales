import fullScreenImage from "../../../assets/full-screen.png";
import normalScreenImage from "../../../assets/normal-screen.png";

const FullScreenKit = ({ onClick, isFullScreen }) => {
  return (
    <button
      className="task-bar-button"
      aria-label={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
      onClick={onClick}
    >
      <img
        className="task-bar-button-icon"
        src={isFullScreen ? normalScreenImage : fullScreenImage}
        alt={isFullScreen ? "exit full screen" : "full screen"}
        height="20"
        width="20"
      />
    </button>
  );
};

export default FullScreenKit;
