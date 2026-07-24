import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import { formatDate } from "@/utils/datetime.js";

const FiscalYearList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dpart_cname", header: "Department", width: "120px" },
    { key: "fsyar_cname", header: "Fiscal Year", width: "80px" },
    {
      key: "fsyar_stdat",
      header: "Start Date",
      width: "80px",
      render: (v) => {
        return formatDate(v);
      },
    },
    {
      key: "fsyar_endat",
      header: "End Date",
      width: "80px",
      render: (v) => {
        return formatDate(v);
      },
    },
    { key: "fsyar_stats", header: "Status", width: "80px" },
    {
      key: "fsyar_iscur",
      header: "Current",
      width: "110px",
      render: (v) => (
        <Badge variant={v ? "success" : "muted"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "fsyar_actve",
      header: "Status",
      width: "110px",
      render: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Active" : "Inactive"}
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
          actve={row.fsyar_actve}
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
      emptyMessage="No fiscal years found"
    />
  );
};
export default FiscalYearList;
