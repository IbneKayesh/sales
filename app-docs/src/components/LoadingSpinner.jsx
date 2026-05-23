import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__ring" />
      <div className="loading-spinner__label">{label}</div>
    </div>
  );
};

export default LoadingSpinner;

