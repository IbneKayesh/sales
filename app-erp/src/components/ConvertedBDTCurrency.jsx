import React from "react";

// Format number in Bangladeshi style (1,10,500.50)
const formatBDTCurrency = (amount) => {
  if (amount == null) return '';
  const [integerPart, decimalPart] = amount.toFixed(2).split(".");
  
  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return formattedOtherNumbers + lastThree + "." + decimalPart;
};

// Convert number to BDT words (crore, lakh, hajar, taka)
const convertToBDTWords = (amount) => {
  if (amount == null) return "";
  
  const units = [
    { value: 10000000, name: "crore" },
    { value: 100000, name: "lakh" },
    { value: 1000, name: "hajar" },
    { value: 1, name: "taka" },
  ];
  
  let remaining = Math.floor(amount);
  let result = [];
  
  for (let unit of units) {
    if (remaining >= unit.value) {
      const count = Math.floor(remaining / unit.value);
      remaining = remaining % unit.value;
      result.push(`${count} ${unit.name}`);
    }
  }

  // Add decimal part as poisha if present
  const decimalPart = Math.round((amount - Math.floor(amount)) * 100);
  if (decimalPart > 0) {
    result.push(`${decimalPart} poisha`);
  }
  
  return result.join(" ");
};

// React component
const ConvertedBDTCurrency = ({ value, asWords = false }) => {
  return (
    <span>
      {asWords ? convertToBDTWords(value) : formatBDTCurrency(value)}
    </span>
  );
};


export default ConvertedBDTCurrency;