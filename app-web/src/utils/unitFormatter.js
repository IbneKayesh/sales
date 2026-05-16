const formatUnits = (retailUnit, fractionQty, packUnit, qty) => {
  const packQty = Math.floor(qty / fractionQty);
  const retailQty = qty % fractionQty;

  return `${packQty} ${packUnit} ${retailQty} ${retailUnit}`;
}
export { formatUnits };