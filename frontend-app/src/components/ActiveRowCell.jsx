const ActiveRowCell = ({
  text,
  status,
  inactiveClass = "text-red-500 line-through",
}) => <span className={status === false ? inactiveClass : undefined}>{text}</span>;

export default ActiveRowCell;