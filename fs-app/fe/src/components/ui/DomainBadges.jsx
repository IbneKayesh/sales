import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarClock,
  Landmark,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { Badge } from "./Badge";
import {
  ACCOUNT_STATUS,
  ACCOUNT_TYPES,
  BANK_STATUS,
  TRANSACTION_TYPES,
} from "../../lib/domain/constants";

const TRANSACTION_ICONS = {
  deposit: ArrowDownLeft,
  profit: TrendingUp,
  withdraw: ArrowUpRight,
  transfer: ArrowLeftRight,
  "dps-installment": CalendarClock,
  "fd-deposit": Landmark,
  charge: ReceiptText,
};

export function TransactionBadge({ type }) {
  const meta = TRANSACTION_TYPES[type] ?? { label: type, tone: "neutral" };
  const Icon = TRANSACTION_ICONS[type];

  return (
    <Badge tone={meta.tone} icon={Icon}>
      {meta.label}
    </Badge>
  );
}

export function AccountTypeBadge({ type }) {
  const meta = ACCOUNT_TYPES[type] ?? { label: type, tone: "neutral" };

  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}

export function StatusBadge({ status, kind = "bank" }) {
  const statuses = kind === "account" ? ACCOUNT_STATUS : BANK_STATUS;
  const meta = statuses[status] ?? { label: status || "Unknown", tone: "neutral" };

  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}
