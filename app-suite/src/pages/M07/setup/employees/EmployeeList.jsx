import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const EmployeeList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "emply_ccode", header: "Code", width: "120px" },
    { key: "emply_cname", header: "Employee Name", width: "220px" },
    { key: "emply_cntno", header: "Contact No", width: "150px" },
    { key: "emply_email", header: "Email", width: "200px" },
    { key: "emply_crdno", header: "Card No", width: "130px" },
    { key: "emply_urole", header: "Role", width: "120px" },
    {
      key: "emply_isprm",
      header: "Permanent",
      width: "110px",
      render: (v) => {
        return (
          <Badge variant={v ? "success" : "secondary"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      key: "emply_actve",
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
          actve={row.emply_actve}
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
      exportFilename="employees.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No employees found"
    />
  );
};
export default EmployeeList;
