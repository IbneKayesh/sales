import { formatNumber } from "@/utils/misc";

const ConvertSize = ({ qty, dfQty, sunit }) => {
  const value = Number(qty) || 0;
  const diff = Number(dfQty) || 1;

  return (
    <span className={""}>
      {formatNumber(value * diff)} {sunit || "N/A"}
    </span>
  );
};

export default ConvertSize;
