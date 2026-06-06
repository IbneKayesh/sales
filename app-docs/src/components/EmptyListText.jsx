import React from "react";

const EmptyListText = ({ children, compact = false, className = "" }) => {
  const combinedClassName = [
    "empty-list-text",
    compact ? "empty-list-text-compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <p className={combinedClassName}>{children}</p>;
};

export default EmptyListText;
