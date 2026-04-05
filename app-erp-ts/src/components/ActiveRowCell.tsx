import React from "react";

interface ActiveRowCellProps {
  text: string;
  status?: boolean;
  inactiveClass?: string;
}

const ActiveRowCell: React.FC<ActiveRowCellProps> = ({
  text,
  status,
  inactiveClass = "text-red-500 line-through",
}) => (
  <span className={status === false ? inactiveClass : undefined}>{text}</span>
);

export default ActiveRowCell;
