import "./DigitalClock.css";

const DigitalClock = ({ style, onMouseDown }) => {
  return (
    <div className="digital-clock" style={style} onMouseDown={onMouseDown}>
      {/* ensure drag starts even if user clicks on inner content */}
      <div className="digital-clock-title" onMouseDown={onMouseDown}>
        Digital Clock
      </div>
      <div className="digital-clock-time" onMouseDown={onMouseDown}>
        12:34
      </div>
    </div>
  );
};


export default DigitalClock;