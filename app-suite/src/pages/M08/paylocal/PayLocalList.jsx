import DataTable from "@/components/DataTable";
import { IconDollar } from "@/icons";
import Button from "@/components/Button";
import { getRelativeDays } from "@/utils/datetime.js";

const PayLocalList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dpart_cname", header: "Department", width: "80px" },
    { key: "party_cname", header: "Name", width: "80px" },
    { key: "ttype", header: "Type", width: "80px" },
    { key: "trnno", header: "Ref No", width: "80px" },
    {
      key: "trdat",
      header: "Due Date",
      width: "80px",
      body: (v) => getRelativeDays(v),
    },
    { key: "notes", header: "Notes", width: "80px" },
    { key: "due_value", header: "Amount", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
          title="Payment"
        >
          <IconDollar size={14} />
        </Button>
      ),
    },
  ];
  return (
    <DataTable
      columns={dtColumns}
      data={listData}
      pageSize={25}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      autofit
    />
  );
};
export default PayLocalList;
