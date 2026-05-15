import React from "react";
import "./LoadingSpinner.css";

/**
 * A professional loading spinner component.
 */
const LoadingSpinner = ({
  fullScreen = false,
  message = "Processing",
  subMessage = "Please wait while we handle your request",
}) => {
  const content = (
    <div className="loading-card">
      <div className="spinner-wrapper">
        <div className="spinner-glow"></div>
        <div className="storm-container">
          <div className="morph-shape"></div>
          <div className="storm-ring"></div>
          <div className="storm-ring delay-1"></div>
          <div className="storm-ring delay-2"></div>
        </div>
      </div>
      <div className="loading-text-group">
        <h2 className="loading-title">{message}</h2>
        <p className="loading-subtitle">{subMessage}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return <div className="loading-overlay">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
