import React from "react";

const BoxComp = ({ title, subtitle, number, subNumber, onClick }) => {
  return (
    <div
      className="surface-card shadow-2 p-3 border-round cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-3">
        <span className="block text-500 font-medium">{title}</span>

        <span className="block text-400 text-sm mt-1">{subtitle}</span>

        <div className="text-900 font-medium text-2xl mt-3">{number}</div>
      </div>

      <div>
        <span
          className={`font-medium ${
            subNumber?.toString().startsWith("-")
              ? "text-pink-500"
              : "text-green-500"
          }`}
        >
          {subNumber}
        </span>
      </div>
    </div>
  );
};

export default BoxComp;
