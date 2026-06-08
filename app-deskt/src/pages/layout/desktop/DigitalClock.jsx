import { useEffect, useState } from "react";
import "./DigitalClock.css";

const DigitalClock = ({ style, onMouseDown }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="digital-clock" style={style} onMouseDown={onMouseDown}>
      {/* ensure drag starts even if user clicks on inner content */}
      <div className="digital-clock-title" onMouseDown={onMouseDown}>
        Digital Clock
      </div>
      <div className="digital-clock-time" onMouseDown={onMouseDown}>
        {formattedTime}
      </div>
      <div className="digital-clock-date" onMouseDown={onMouseDown}>
        {formattedDate}
      </div>
    </div>
  );
};


export default DigitalClock;