import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

/**
 * A professional loading spinner component that can be used as a standalone
 * element or a full-screen overlay.
 *
 * @param {boolean} fullScreen - Whether to show as a full-screen overlay
 * @param {string} message - Primary message text
 * @param {string} subMessage - Secondary message text
 */
const LoadingSpinner = ({
  fullScreen = false,
  message = "Processing",
  subMessage = "Please wait while we handle your request",
}) => {
  const content = (
    <div
      className="loading-card flex flex-column align-items-center gap-5 p-7 border-round-3xl"
      style={{ position: "relative", userSelect: "none" }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 var(--primary-color, #2196f3); opacity: 0.4; }
          70% { box-shadow: 0 0 0 20px var(--primary-color, #2196f3); opacity: 0; }
          100% { box-shadow: 0 0 0 0 var(--primary-color, #2196f3); opacity: 0; }
        }
        .loading-card {
          background: rgba(236, 240, 243, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-width: 320px;
          position: relative;
          overflow: hidden;
        }
        .loading-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: skewX(-35deg);
          transition: 0.75s;
          animation: shine 2s infinite;
        }
        @keyframes shine {
          100% { left: 200%; }
        }
      `}</style>
      <div className="relative flex align-items-center justify-content-center">
        <ProgressSpinner
          style={{ width: "100px", height: "100px" }}
          strokeWidth="3"
          fill="transparent"
          animationDuration="1.2s"
        />
        <div
          className="absolute border-circle flex align-items-center justify-content-center"
          style={{
            width: "42px",
            height: "42px",
            background: "var(--primary-color)",
            opacity: 0.08,
            animation: "pulseGlow 2s infinite",
          }}
        ></div>
      </div>

      <div className="flex flex-column align-items-center gap-3">
        <h2
          className="m-0 text-2xl font-bold text-900 tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          {message}
        </h2>
        <p className="m-0 text-600 font-medium text-center">{subMessage}</p>
      </div>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div
      className="loading-overlay flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        zIndex: 10000,
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      {content}
    </div>
  );
};

export default LoadingSpinner;
