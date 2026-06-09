import desktopImage from "../../../assets/icons/desktop.png";

const DesktopKit = ({ onClick }) => {
  return (
    <button
      className="task-bar-button"
      aria-label="Show desktop"
      onClick={onClick}
    >
      <img
        className="task-bar-button-icon"
        src={desktopImage}
        alt="show desktop"
        height="20"
        width="20"
      />
    </button>
  );
};

export default DesktopKit;
