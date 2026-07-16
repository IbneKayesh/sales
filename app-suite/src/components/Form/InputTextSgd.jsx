import React, { useId } from "react";

const InputTextSgd = ({ id, value, required, disabled, onChange, label }) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="input-box">
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="input-text"
      ></input>
    </div>
  );
};
