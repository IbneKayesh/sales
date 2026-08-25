import Badge from "@/components/Badge";
import { IconWarning } from "@/icons";

// const NegativeValue = ({ value, precision = 2 }) => {
//   const num = Number(value);
//   if (num < 0.1) {
//     return (
//       <Badge variant="danger" icon={<IconWarning size={12} />}>
//         {value.toFixed(precision)}
//       </Badge>
//     );
//   }

//   return <span>{value ?? "—"}</span>;
// };

// export default NegativeValue;


const NegativeValue = ({ value, precision = 2 }) => {
  if (value == null || value === "") {
    return <span>—</span>;
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return <span>{value}</span>;
  }

  if (num < 0) {
    return (
      <Badge variant="danger" icon={<IconWarning size={12} />}>
        {num.toFixed(precision)}
      </Badge>
    );
  }

  return <span>{num.toFixed(precision)}</span>;
};

export default NegativeValue;