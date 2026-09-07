import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import InactiveText from "@/components/InactiveText";

const UsersList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "emply_ccode", header: "Code", width: "80px" },
    {
      key: "emply_cname",
      header: "Name",
      width: "80px",
      body: (_, row) => {
        return <InactiveText text={row.emply_cname} active={row.emply_actve} />;
      },
    },
    { key: "emply_cntno", header: "Contact", width: "80px" },
    { key: "emply_email", header: "Email", width: "80px" },
    {
      key: "emply_islgn",
      header: "Allow Login",
      width: "80px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "emply_isprm",
      header: "Master User",
      width: "80px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),

     },
    { key: "emply_urole", header: "Role", width: "80px" },
    { key: "emply_crdno", header: "Card No", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
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
      pageSize={15}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      autofit
    />
  );
};
export default UsersList;
