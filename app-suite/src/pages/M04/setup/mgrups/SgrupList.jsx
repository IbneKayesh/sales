import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const SgrupList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "sgrup_ccode", header: "Code", width: "120px" },
    { key: "sgrup_cname", header: "Sub Group Name", width: "200px" },
    {
      key: "sgrup_actve",
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
          actve={row.sgrup_actve}
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
      exportFilename="sub-groups-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No sub groups found"
    />
  );
};
export default SgrupList;
