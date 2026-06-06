import React, { useState, useEffect } from "react";
import "./SystemClock.css";

const SystemClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = time.toLocaleDateString([], {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="system-clock">
      <span className="system-clock-time">{formattedTime}</span>
      <span className="system-clock-date">{formattedDate}</span>
    </div>
  );
};

export default SystemClock;
