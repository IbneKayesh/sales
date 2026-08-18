import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const DesignationsList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "desig_ccode", header: "Code", width: "80px" },
    { key: "desig_cname", header: "Name", width: "120px" },
    { key: "desig_level", header: "Level", width: "80px" },
    { key: "desig_sname", header: "Short Name", width: "80px" },
    { key: "desig_pname", header: "Parent", width: "80px" },
    {
      key: "desig_actve",
      header: "Status",
      width: "120px",
      body: (v) => {
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
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.desig_actve}
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
    />
  );
};
export default DesignationsList;
