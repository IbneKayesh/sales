import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const DepartmentList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "dpart_cname", header: "Name", width: "180px" },
    { key: "dpart_ccode", header: "Code", width: "120px" },
    { key: "dpart_ofadr", header: "Office Address", width: "200px" },
    { key: "dpart_emcap", header: "Emp Capacity", width: "130px" },
    {
      key: "dpart_actve",
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
          actve={row.dpart_actve}
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
      exportFilename="departments-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No departments found"
    />
  );
};
export default DepartmentList;
