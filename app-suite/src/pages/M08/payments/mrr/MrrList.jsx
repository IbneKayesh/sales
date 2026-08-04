import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconDollar, IconClose, IconCheck } from "@/icons";
import Button from "@/components/Button";
import { getRelativeDays } from "@/utils/datetime.js";

const MrrList = ({ listData, onEdit }) => {
  const dtColumns = [
    { key: "mrrdm_trnno", header: "MRR No", width: "100px" },
    {
      key: "mrrdm_trdat",
      header: "Date",
      width: "90px",
      render: (v) => getRelativeDays(v),
    },
    { key: "dpart_cname", header: "Department", width: "150px" },
    { key: "cntct_cname", header: "Supplier", width: "180px" },
    { key: "mrrdm_refno", header: "Ref No", width: "100px" },
    { key: "mrrdm_tramt", header: "Amount", width: "100px" },
    { key: "mrrdm_pyamt", header: "Payable", width: "100px" },
    { key: "mrrdm_duamt", header: "Due", width: "100px" },
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
      exportFilename="mrr-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No MRR records found"
      className="mt-2"
    />
  );
};
export default MrrList;
