import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { toast } from "@/components/ToastBox";
import {
  IconCheck,
  IconWarning,
  IconInfo,
  IconClose,
} from "@/icons";
import { formatCurrency } from "@/utils/misc";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const txnColumns = [
  {
    key: "date",
    header: "Date",
    width: "110px",
    body: (v) => <span style={{ whiteSpace: "nowrap" }}>{formatDate(v)}</span>,
  },
  { key: "description", header: "Description", width: "auto" },
  { key: "category", header: "Category", width: "120px" },
  {
    key: "amount",
    header: "Amount",
    width: "100px",
    body: (v, row) => (
      <span className={`text-mono text-mono--${row.type === "income" ? "success" : "danger"}`}>
        {row.type === "income" ? "+" : "–"}
        {formatCurrency(Math.abs(v), 2)}
      </span>
    ),
  },
  {
    key: "type",
    header: "Type",
    width: "80px",
    body: (v) => <Badge type={v}>{v === "income" ? "Income" : "Expense"}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    width: "110px",
    body: (v) => (
      <Badge
        variant={
          v === "completed"
            ? "success"
            : v === "pending"
              ? "warning"
              : v === "failed"
                ? "danger"
                : "muted"
        }
        icon={
          v === "completed" ? (
            <IconCheck size={12} />
          ) : v === "pending" ? (
            <IconWarning size={12} />
          ) : v === "failed" ? (
            <IconClose size={12} />
          ) : (
            <IconInfo size={12} />
          )
        }
      >
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </Badge>
    ),
  },
];

export default function RecentTransactions({ transactions }) {
  return (
    <PageCard>
      <PageCardHeader>
        <PageCardTitle
          title="Recent Transactions"
          subtitle="Latest financial activity across the organization"
        />
      </PageCardHeader>
      <PageCardBody>
        <DataTable
          columns={txnColumns}
          data={transactions}
          pageSize={5}
          sortable
          hoverable
          searchable
          onRowClick={(row) => toast.info(`Transaction: ${row.description}`)}
          emptyMessage="No transactions yet"
        />
      </PageCardBody>
    </PageCard>
  );
}