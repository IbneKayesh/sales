import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen }) => {
  const spinner = (
    <div className="flex align-items-center justify-content-center p-5">
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="4"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed top-0 left-0 w-full h-full flex align-items-center justify-content-center z-5"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
