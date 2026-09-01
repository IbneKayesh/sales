const ConvertUOM = ({ qty, dfQty, sname, pname }) => {
  const value = Number(qty) || 0;

  if (pname === sname) {
    return (
      <span className={value === 0 ? "text-red-400" : ""}>
        {`${value.toFixed(2)} ${pname || "N/A"}`}
      </span>
    );
  }

  const diff = Number(dfQty) || 1;
  const big = Math.floor(value / diff);
  const small = value % diff;

  return (
    <span className={value === 0 ? "text-red-400" : ""}>
      {big > 0 && `${big} ${sname || "N/A"}`}
      {big > 0 && small > 0 && " "}
      {small > 0 && `${small} ${pname || "N/A"}`}
      {value === 0 && `0 ${pname || "N/A"}`}
    </span>
  );
};

export default ConvertUOM;