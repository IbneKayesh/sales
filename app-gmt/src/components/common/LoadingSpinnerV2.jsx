import "./LoadingSpinnerV2.css";

export default function LoadingSpinnerV2({ show = true }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="card">
        <div className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
}