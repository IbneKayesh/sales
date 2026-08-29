import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import { getRelativeDays, formatDate } from "@/utils/datetime.js";

const ProcessList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "promf_trnno", header: "Trn No", width: "80px" },
    {
      key: "promf_trdat",
      header: "Trn Date",
      width: "80px",
      body: (v) => getRelativeDays(v),
    },
    { key: "promf_cname", header: "Process", width: "200px" },
    { key: "promf_prono", header: "Process", width: "80px" },
    {
      key: "promf_frdat",
      header: "From",
      width: "80px",
      body: (v) => formatDate(v),
    },
    {
      key: "promf_todat",
      header: "To",
      width: "80px",
      body: (v) => formatDate(v),
    },
    { key: "promf_prtim", header: "Time (Min)", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
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
      pageSize={15}
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
