import React from "react";

const ConvertedQtyComponent = ({ qty, rowData }) => {
  const diff = rowData.unit_difference_qty || 1;
  const big = Math.floor(qty / diff);
  const small = qty % diff;
  return (
    <span className={`${qty === 0 ? "text-red-400" : ""}`}>
      {`${big} ${rowData.large_unit_name || ""} ${small} ${
        rowData.small_unit_name || ""
      }`}
    </span>
  );
};

export default ConvertedQtyComponent;
