import React, { useState, useEffect } from "react";
import "./AnalogClock.css";

export default function AnalogClock({ noBackdrop = false }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hr = time.getHours();

  const secDeg = sec * 6;
  const minDeg = min * 6 + (sec * 6) / 60;
  const hrDeg = (hr % 12) * 30 + (min * 30) / 60;

  return (
    <div className="ac-screen">
      <div className="ac-ambient-light ac-light-1"></div>
      <div className="ac-ambient-light ac-light-2"></div>
      <div className="ac-ambient-light ac-light-3"></div>
      <div className={`ac-glass-card${noBackdrop ? " ac-glass-card--no-backdrop" : ""}`}>
        <div className="ac-clock-face">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="ac-hour-marker" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="ac-marker" />
            </div>
          ))}
          <div className="ac-ring ac-sec" style={{ transform: `rotate(${secDeg}deg)` }} />
          <div className="ac-ring ac-min" style={{ transform: `rotate(${minDeg}deg)` }} />
          <div className="ac-ring ac-hr" style={{ transform: `rotate(${hrDeg}deg)` }} />
          <div className="ac-center-dot" />
        </div>
        <div className="ac-clock-info">
          <div className="ac-digital-time">
            {time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="ac-digital-date">
            {time.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
