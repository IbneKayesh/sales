import "./ShowDesktopBtn.css";
import desktopImage from "../../../assets/desktop.png";

const ShowDesktopBtn = ({ isDesktopActive, onToggleClick }) => {
  return (
    <button
      className={`show-desktop-btn ${isDesktopActive ? "active" : ""} hide-small-screen`}
      onClick={onToggleClick}
      title={isDesktopActive ? "Restore Windows" : "Show Desktop"}
    >
      <img
        src={desktopImage}
        alt="Desktop View"
        width="24"
        height="24"
        style={{ color: "var(--accent-light)" }}
      />
    </button>
  );
};
export default ShowDesktopBtn;
