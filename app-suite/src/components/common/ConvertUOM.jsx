const ConvertUOM = ({ qty, dfQty, runit, punit }) => {
  const value = Number(qty) || 0;

  if (punit === runit) {
    return (
      <span className={value === 0 ? "text-red-400" : ""}>
        {`${value.toFixed(2)} ${punit || "N/A"}`}
      </span>
    );
  }

  const diff = Number(dfQty) || 1;

  // How many bulk packs?
  const big = Math.floor(value / diff);

  // Remaining retail units
  const small = value % diff;

  return (
    <span className={value === 0 ? "text-red-400" : ""}>
      {big > 0 && `${big} ${punit || "N/A"}`}
      {big > 0 && small > 0 && " "}
      {small > 0 && `${small} ${runit || "N/A"}`}
      {value === 0 && `0 ${runit || "N/A"}`}
    </span>
  );
};

export default ConvertUOM;
