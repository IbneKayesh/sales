import startImage from "../../../assets/start.png";

const StartKit = ({ onClick }) => {
  return (
    <button className="task-bar-button" aria-label="Start" onClick={onClick}>
      <img
        className="task-bar-button-icon"
        src={startImage}
        alt="start"
        height="20"
        width="20"
      />
    </button>
  );
};

export default StartKit;
