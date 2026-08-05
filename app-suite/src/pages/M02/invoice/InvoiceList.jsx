import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import { getRelativeDays } from "@/utils/datetime.js";

const MrrList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "mrrdm_trnno",
      header: "MRR No",
      width: "100px",
      render: (_, row) => {
        return (
          <span className={`${!row.mrrdm_actve && "text-red-500"}`}>
            {row.mrrdm_trnno}
          </span>
        );
      },
    },
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
    {
      key: "mrrdm_ispst",
      header: "Posted",
      width: "80px",
      render: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.mrrdm_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
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
