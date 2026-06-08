import windowImage from "../../../assets/window.png";

const WindowKit = ({ onClick }) => {
  return (
    <button className="task-bar-button" aria-label="Windows" onClick={onClick}>
      <img
        className="task-bar-button-icon"
        src={windowImage}
        alt="windows"
        height="20"
        width="20"
      />
    </button>
  );
};

export default WindowKit;
