import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const TerritoryList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "trtry_cname", header: "Territory Name", width: "200px" },
    { key: "trtry_tarea", header: "Territory Area", width: "180px" },
    {
      key: "trtry_actve",
      header: "Status",
      width: "120px",
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
          actve={row.trtry_actve}
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
      exportFilename="territories-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No territories found"
    />
  );
};
export default TerritoryList;
