import React from "react";

const ConvertedQtyComponent = ({ qty, rowData }) => {
  const diff = rowData.unit_difference_qty || 1;
  const big = Math.floor(qty / diff);
  const small = qty % diff;
  return `${big} ${rowData.large_unit_name || ""} ${small} ${
    rowData.small_unit_name || ""
  }`;
};

export default ConvertedQtyComponent;
