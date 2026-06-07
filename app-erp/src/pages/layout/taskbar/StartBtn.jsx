import "./StartBtn.css";
import startImage from "../../../assets/start.png";

const StartBtn = ({ onStartClick }) => {
  return (
    <button
      className="start-btn"
      onClick={onStartClick}
      title="Start Menu"
      style={{ color: "var(--accent-light)" }}
    >
      {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 1.5H10.8V10.8H1.5V1.5Z" fill="currentColor" />
        <path d="M13.2 1.5H22.5V10.8H13.2V1.5Z" fill="currentColor" />
        <path d="M1.5 13.2H10.8V22.5H1.5V13.2Z" fill="currentColor" />
        <path d="M13.2 13.2H22.5V22.5H13.2V13.2Z" fill="currentColor" />
      </svg> */}
      <img
        src={startImage}
        alt="Start"
        width="24"
        height="24"
        style={{ color: "var(--accent-light)" }}
      />
    </button>
  );
};
export default StartBtn;
