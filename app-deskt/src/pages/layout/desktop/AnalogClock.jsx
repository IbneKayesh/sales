import { useEffect, useMemo, useRef, useState } from "react";
import "./AnalogClock.css";

export default function AnalogClock({ style, onMouseDown }) {
  const [now, setNow] = useState(new Date());
  const frameRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      setNow(new Date());
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const angles = useMemo(() => {
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    const smoothSeconds = s + ms / 1000;
    const smoothMinutes = m + smoothSeconds / 60;
    const smoothHours = h + smoothMinutes / 60;

    return {
      hour: smoothHours * 30,
      minute: smoothMinutes * 6,
      second: smoothSeconds * 6,
    };
  }, [now]);

  return (
    <div className="analog-clock" style={style} onMouseDown={onMouseDown}>
      <div className="analog-clock-face">
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`hour-marker ${i % 3 === 0 ? "major" : ""}`}
            style={{ transform: `rotate(${i * 30}deg)` }}
          />
        ))}

        {/* Hour hand */}
        <div
          className="hand-wrapper"
          style={{ transform: `translate(-50%, -50%) rotate(${angles.hour}deg)` }}
        >
          <div className="hand hour-hand" />
        </div>

        {/* Minute hand */}
        <div
          className="hand-wrapper"
          style={{ transform: `translate(-50%, -50%) rotate(${angles.minute}deg)` }}
        >
          <div className="hand minute-hand" />
        </div>

        {/* Second hand */}
        <div
          className="hand-wrapper"
          style={{ transform: `translate(-50%, -50%) rotate(${angles.second}deg)` }}
        >
          <div className="hand second-hand" />
        </div>

        <div className="clock-center" />
      </div>
    </div>
  );
}