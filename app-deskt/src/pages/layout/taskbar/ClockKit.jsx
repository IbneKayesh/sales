import { useEffect, useState } from "react";

const formatClock = () => ({
  time: new Intl.DateTimeFormat("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date()),
  date: new Intl.DateTimeFormat("en-BD", {
    month: "short",
    day: "2-digit",
    year: "2-digit",
  }).format(new Date()),
});

const ClockKit = () => {
  const [clock, setClock] = useState(formatClock);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock()), 1000 * 30);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <button className="task-bar-button task-bar-clock" aria-label="Date and time">
      <span className="task-bar-time">{clock.time}</span>
      <span className="task-bar-date">{clock.date}</span>
    </button>
  );
};

export default ClockKit;
