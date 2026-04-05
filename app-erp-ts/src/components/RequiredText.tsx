import React from "react";

interface RequiredTextProps {
  text?: string;
}

const RequiredText: React.FC<RequiredTextProps> = ({ text }) => {
  return text ? (
    <small className="mb-3 text-red-500 text-sm">{text}</small>
  ) : null;
};

export default RequiredText;
