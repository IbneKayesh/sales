import { IconClose } from "@/icons";
import Badge from "./Badge";

export default function InactiveText({ text, active }) {
  return (
    <Badge variant={!active && "danger"}>
      {!active && <IconClose size={12} />}
      {text}
    </Badge>
  );
}
