import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
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
        <ProgressSpinner
          className="theme-spinner"
          style={{ width: "80px", height: "80px" }}
          strokeWidth="4"
          fill="transparent"
          animationDuration="1.5s"
        />
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
