import { IconWarning } from "@/icons";

const NegativeValue = ({ value }) => {
  const num = Number(value);
  console.log("num", num);
  if (num < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-red-500 font-medium">
        <IconWarning size={12} />
        {value}
      </span>
    );
  }

  return <span>{value}</span>;
};

export default NegativeValue;
