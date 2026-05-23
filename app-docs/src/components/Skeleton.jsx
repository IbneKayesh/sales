// Skeleton.jsx - Skeleton loading component
import React from "react";
import "./Skeleton.css";

// Skeleton text line
export const SkeletonText = ({
  lines = 3,
  width = "100%",
  lastWidth = "60%",
}) => {
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            width: i === lines - 1 ? lastWidth : width,
          }}
        />
      ))}
    </div>
  );
};

// Skeleton table row
export const SkeletonTableRow = ({ columns = 6 }) => {
  return (
    <tr className="skeleton-table-row">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-cell" />
        </td>
      ))}
    </tr>
  );
};

// Skeleton table with header
export const SkeletonTable = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="skeleton-table">
      <table>
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <div className="skeleton-cell skeleton-cell-header" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Skeleton card
export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-header">
        <div
          className="skeleton-circle"
          style={{ width: "40px", height: "40px" }}
        />
        <div className="skeleton-card-title">
          <div
            className="skeleton-line"
            style={{ width: "120px", height: "16px" }}
          />
          <div
            className="skeleton-line"
            style={{ width: "180px", height: "12px", marginTop: "8px" }}
          />
        </div>
      </div>
      <div className="skeleton-card-body">
        <SkeletonText lines={2} />
      </div>
    </div>
  );
};

// Skeleton card grid
export const SkeletonCardGrid = ({ count = 4 }) => {
  return (
    <div className="skeleton-card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

// Main Skeleton component with type selector
const Skeleton = ({ type = "text", ...props }) => {
  switch (type) {
    case "table":
      return <SkeletonTable {...props} />;
    case "card":
      return <SkeletonCard {...props} />;
    case "cardGrid":
      return <SkeletonCardGrid {...props} />;
    case "text":
    default:
      return <SkeletonText {...props} />;
  }
};

export default Skeleton;
