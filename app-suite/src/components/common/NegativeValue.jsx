import Badge from "@/components/Badge";
import { IconWarning } from "@/icons";

const NegativeValue = ({ value }) => {
  const num = Number(value);
  if (num < 0.1) {
    return (
      <Badge variant="danger" icon={<IconWarning size={12} />}>
        {value}
      </Badge>
    );
  }

  return <span>{value ?? "—"}</span>;
};

export default NegativeValue;
