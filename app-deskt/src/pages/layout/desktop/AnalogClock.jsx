import "./AnalogClock.css";

const AnalogClock = ({ style, onMouseDown }) => {
  return (
    <div className="analog-clock" style={style} onMouseDown={onMouseDown}>
      {/* ensure drag starts even if user clicks on inner content */}
      <div className="analog-clock-inner" onMouseDown={onMouseDown}>
        Analog Clock Widget
      </div>
    </div>
  );
};


export default AnalogClock;
