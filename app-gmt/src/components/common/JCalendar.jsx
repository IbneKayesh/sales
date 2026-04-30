import React from "react";
import { Calendar, Clock } from "lucide-react";
import "./JCalendar.css";

const JCalendar = ({
  label,
  error,
  size = "md",
  className = "",
  format = "date", // "date" | "datetime"
  ...props
}) => {
  const inputType = format === "datetime" ? "datetime-local" : "date";

  return (
    <div className={`j-calendar-container j-calendar-${size} ${className}`}>
      {label && <label className="j-calendar-label">{label}</label>}

      <div className="j-calendar-input-wrapper">
        <input
          type={inputType}
          className={`j-calendar-field ${error ? "j-calendar-error" : ""}`}
          {...props}
        />

        <span className="j-calendar-icon">
          {format === "datetime" ? <Clock size={16} /> : <Calendar size={16} />}
        </span>
      </div>

      {error && <span className="j-calendar-error-text">{error}</span>}
    </div>
  );
};

export default JCalendar;
