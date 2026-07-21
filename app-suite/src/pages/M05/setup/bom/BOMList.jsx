import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import { getRelativeDays } from "@/utils/datetime.js";

const BOMList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "bommf_trnno", header: "Trn No", width: "80px" },
    {
      key: "bommf_trdat",
      header: "Trn Date",
      width: "80px",
      render: (v) => getRelativeDays(v),
    },
    { key: "prods_cname", header: "Production", width: "200px" },
    { key: "bommf_cname", header: "Process", width: "200px" },
    { key: "bommf_prono", header: "Process No", width: "80px" },
    { key: "bommf_inout", header: "Input/Output", width: "80px" },
    { key: "bommf_bmqty", header: "Qty", width: "80px" },
    { key: "bommf_estim", header: "Est Minutes", width: "80px" },
    {
      key: "bommf_actve",
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
          actve={row.bommf_actve}
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
      emptyMessage="No BOM records found"
      className="mt-2"
    />
  );
};
export default BOMList;
