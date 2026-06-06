import "./QuickViewBtn.css";
import quickviewImage from "../../../assets/quick-view.png";

const QuickViewBtn = ({ onToggleClick }) => {
  return (
    <button
      className="quick-view-btn hide-small-screen"
      onClick={onToggleClick}
      title="Quick View"
    >
      {/* <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg> */}

      <img
        src={quickviewImage}
        alt="Quick View"
        width="24"
        height="24"
        style={{ color: "var(--accent-light)" }}
      />
    </button>
  );
};
export default QuickViewBtn;
