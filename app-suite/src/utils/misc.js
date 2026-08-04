const formatNumber = (val) => {
  const num = Number(val) || 0;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export { formatNumber };
