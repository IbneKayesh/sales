import { useEffect, useMemo, useRef, useState } from "react";
import "./DigitalClock.css";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const DIGIT_TO_SEGMENTS = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "c", "d", "g"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "e", "d", "c", "g"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

const SegmentDigit = ({ digit, alt }) => {
  const active = new Set(DIGIT_TO_SEGMENTS[digit] || []);
  const seg = (name) => (
    <span key={name} className={active.has(name) ? "seg on" : "seg"} />
  );

  return (
    <div className="seg-digit" role="img" aria-label={alt}>
      <div className="seg-grid">
        {seg("a")}
        {seg("b")}
        {seg("c")}
        {seg("d")}
        {seg("e")}
        {seg("f")}
        {seg("g")}
      </div>
    </div>
  );
};

function getISOWeekNumber(date) {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7; // Mon=1..Sun=7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
}

const DigitalClock = ({ style, onMouseDown }) => {
  const [time, setTime] = useState(() => new Date());
  const timeoutRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const next = new Date();
      setTime(next);

      // align updates close to second boundary for less drift than setInterval(1000)
      const ms = 1000 - next.getMilliseconds();
      timeoutRef.current = window.setTimeout(tick, clamp(ms, 0, 1000));
    };

    timeoutRef.current = window.setTimeout(tick, 0);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const { timeText, ampm, dateText, dayName, weekNo } = useMemo(() => {
    const hour24 = time.getHours();
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

    const hh = String(hour12).padStart(2, "0");
    const mm = String(time.getMinutes()).padStart(2, "0");

    const ampmText = hour24 >= 12 ? "PM" : "AM";

    const weekday = time.toLocaleDateString("en-US", { weekday: "long" });
    const dateT = time.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const weekNumber = getISOWeekNumber(time);

    return {
      timeText: `${hh}:${mm}`,
      ampm: ampmText,
      dayName: weekday,
      dateText: dateT,
      weekNo: String(weekNumber).padStart(2, "0"),
    };
  }, [time]);

  const second = time.getSeconds();
  const dotsOn = second % 2 === 0;

  const [hh1, hh2] = timeText.split(":")[0].split("");
  const [mm1, mm2] = timeText.split(":")[1].split("");

  return (
    <div className="digital-clock" style={style} onMouseDown={onMouseDown}>
      <div className="digital-clock-title" onMouseDown={onMouseDown} />

      <div
        className="digital-clock-time digital-clock-7seg"
        onMouseDown={onMouseDown}
        aria-label="Current time"
      >
        <SegmentDigit digit={Number(hh1)} alt={`Hour tens ${hh1}`} />
        <SegmentDigit digit={Number(hh2)} alt={`Hour units ${hh2}`} />

        <div className="seg-colon" aria-hidden="true">
          <span className={dotsOn ? "dot on" : "dot"} />
          <span className={dotsOn ? "dot on" : "dot"} />
        </div>

        <SegmentDigit digit={Number(mm1)} alt={`Minute tens ${mm1}`} />
        <SegmentDigit digit={Number(mm2)} alt={`Minute units ${mm2}`} />

        <div className="digital-clock-ampm" aria-label="AM or PM">
          {ampm}
        </div>
      </div>

      <div
        className="digital-clock-date"
        onMouseDown={onMouseDown}
        aria-label="Current date"
      >
        <div>{dayName}</div>
        <div className="digital-clock-date-row">
          <span>{dateText}</span>
          <span className="digital-clock-week">Wk {weekNo}</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;

