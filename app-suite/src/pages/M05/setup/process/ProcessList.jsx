import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import { getRelativeDays } from "@/utils/datetime.js";

const ProcessList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "promf_trnno", header: "Trn No", width: "80px" },
    {
      key: "promf_trdat",
      header: "Trn Date",
      width: "80px",
      render: (v) => getRelativeDays(v),
    },
    { key: "bommf_cname", header: "BOM", width: "200px" },
    { key: "promf_cname", header: "Process", width: "200px" },
    { key: "promf_prono", header: "Process No", width: "80px" },
    { key: "promf_bmqty", header: "BOM Qty", width: "80px" },
    { key: "promf_prqty", header: "Proc Qty", width: "80px" },
    { key: "promf_prtim", header: "Time (Min)", width: "80px" },
    {
      key: "promf_actve",
      header: "Status",
      width: "110px",
      render: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.promf_actve}
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
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No Process records found"
      className="mt-2"
    />
  );
};
export default ProcessList;
