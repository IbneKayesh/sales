const ZeroRowCell = ({ value, text }) => {
  return (
    <span className={Number(value) === 0 ? "text-gray-300" : undefined}>
      {text}
    </span>
  );
};

export default ZeroRowCell;