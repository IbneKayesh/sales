const ActiveRowCell = ({
  text,
  status,
  inactiveClass = "text-red-500 line-through",
}) => <span className={status === 0 ? inactiveClass : undefined}>{text}</span>;

export default ActiveRowCell;