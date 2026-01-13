const ConvertedQtyComponent = ({ qty, dfQty, pname, sname }) => {
  const diff = dfQty || 1;
  const big = Math.floor(qty / diff);
  const small = qty % diff;
  return (
    <span className={`${qty === 0 ? "text-red-400" : ""}`}>
      {`${big} ${pname || "N/A"} ${small} ${sname || "N/A"}`}
    </span>
  );
};

export default ConvertedQtyComponent;
