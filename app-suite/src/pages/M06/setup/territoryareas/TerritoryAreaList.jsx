import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const TerritoryAreaList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "tarea_cname", header: "Area Name", width: "200px" },
    { key: "tarea_dzone", header: "Delivery Zone", width: "180px" },
    {
      key: "tarea_actve",
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
          actve={row.tarea_actve}
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
      exportFilename="territory-areas-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No territory areas found"
    />
  );
};
export default TerritoryAreaList;
