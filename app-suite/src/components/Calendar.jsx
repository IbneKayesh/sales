import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "../icons";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n) => String(n).padStart(2, "0");

const toDateStr = (year, month, day) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

/** Parse a value (Date or 'YYYY-MM-DD' string) into a local date at midnight. */
const normalize = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime())
      ? null
      : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const datePart = String(value).includes("T")
    ? String(value).split("T")[0]
    : String(value);
  const d = new Date(`${datePart}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Calendar — standalone month calendar (nav + day grid) reused by the
 * InputCalendar field and the taskbar clock popup. Pure view: it reports the
 * picked day via `onSelect('YYYY-MM-DD')` and never renders a wrapper/popup,
 * so callers decide where and how it is displayed.
 */
export default function Calendar({
  value,
  onSelect,
  className = "",
}) {
  const selected = normalize(value);
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    selected?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selected?.getMonth() ?? today.getMonth(),
  );

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedStr = selected ? toDateStr(selected.getFullYear(), selected.getMonth(), selected.getDate()) : null;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day) => {
    if (onSelect) onSelect(toDateStr(viewYear, viewMonth, day));
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <span key={`empty-${i}`} className="input-calendar__day input-calendar__day--empty" />,
    );
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = toDateStr(viewYear, viewMonth, d);
    const isSelected = dayStr === selectedStr;
    const isToday = dayStr === todayStr;
    cells.push(
      <button
        key={d}
        type="button"
        className={`input-calendar__day${isSelected ? " input-calendar__day--selected" : ""}${isToday ? " input-calendar__day--today" : ""}`}
        onClick={() => handleSelectDay(d)}
      >
        {d}
      </button>,
    );
  }

  return (
    <div className={`calendar${className ? " " + className : ""}`}>
      <div className="input-calendar__nav">
        <button
          type="button"
          className="input-calendar__nav-btn"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <IconChevronLeft size={14} />
        </button>
        <span className="input-calendar__nav-label">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="input-calendar__nav-btn"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <IconChevronRight size={14} />
        </button>
      </div>
      <div className="input-calendar__grid">
        {DAYS.map((w) => (
          <span key={w} className="input-calendar__day input-calendar__day--header">
            {w}
          </span>
        ))}
        {cells}
      </div>
    </div>
  );
}
