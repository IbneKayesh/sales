import "./TopbarKit.css";

const TopbarKit = ({ onClose, onMinimize, onMaximize }) => {
  return (
    <div className="form-topbar">
      <div className="form-topbar-left">
        <button className="btn-default" aria-label="add" type="button">
          Add
        </button>
        <button className="btn-default" aria-label="search" type="button">
          Search
        </button>
      </div>
      <div className="form-topbar-center">
        <input
          className="input-default"
          placeholder="Search or type URL"
          aria-label="search input"
        />
      </div>
      <div className="form-topbar-right">
        <button
          className="btn-default"
          aria-label="minimize"
          type="button"
          onClick={onMinimize}
        >
          Min
        </button>
        <button
          className="btn-default"
          aria-label="maximize"
          type="button"
          onClick={onMaximize}
        >
          Max
        </button>
        <button
          className="btn-default"
          aria-label="close"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TopbarKit;

