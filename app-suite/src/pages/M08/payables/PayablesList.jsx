import DataTable from "@/components/DataTable";
import { IconDollar } from "@/icons";
import Button from "@/components/Button";
import { getRelativeDays } from "@/utils/datetime.js";

const PayablesList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dpart_cname", header: "Department", width: "80px" },
    { key: "cntct_cname", header: "Name", width: "80px" },
    { key: "mrrdm_ttype", header: "Type", width: "80px" },
    { key: "mrrpy_refno", header: "Ref No", width: "80px" },
    {
      key: "mrrdm_trdat",
      header: "Due Date",
      width: "80px",
      render: (v) => getRelativeDays(v),
    },
    { key: "mrrpy_notes", header: "Notes", width: "80px" },
    { key: "mrrpy_duamt", header: "Amount", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
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
      pageSize={10}
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
export default PayablesList;
