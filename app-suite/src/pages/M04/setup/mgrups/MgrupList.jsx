import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const MgrupList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "mgrup_ccode", header: "Code", width: "180px" },
    { key: "mgrup_cname", header: "Group Name", width: "200px" },
    {
      key: "mgrup_actve",
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
          actve={row.mgrup_actve}
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
      exportFilename="main-groups-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No main groups found"
    />
  );
};
export default MgrupList;
