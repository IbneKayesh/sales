import { useEffect, useState } from "react";
import "./HomePage.css";

export default function HomePage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hr = time.getHours();

  const secDeg = sec * 6;
  const minDeg = min * 6 + (sec * 6) / 60;
  const hrDeg = (hr % 12) * 30 + (min * 30) / 60;

  return (
    <div className="screen">
      <div className="ambient-light light-1"></div>
      <div className="ambient-light light-2"></div>
      <div className="ambient-light light-3"></div>

      <div className="glass-card">
        <div className="clock-face">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="hour-marker" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="marker" />
            </div>
          ))}

          <div className="ring sec" style={{ transform: `rotate(${secDeg}deg)` }} />
          <div className="ring min" style={{ transform: `rotate(${minDeg}deg)` }} />
          <div className="ring hr" style={{ transform: `rotate(${hrDeg}deg)` }} />
          <div className="center-dot" />
        </div>

        <div className="clock-info">
          <div className="digital-time">
            {time.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="digital-date">
            {time.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </div>
        </div>
      </div>
    </div>
  );
}