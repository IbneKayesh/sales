import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const AttrbList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "attrb_ccode", header: "Code", width: "100px" },
    { key: "attrb_cname", header: "Attribute Name", width: "180px" },
    { key: "attrb_mcatg", header: "Main Category", width: "150px" },
    { key: "attrb_dtype", header: "Data Type", width: "120px" },
    { key: "attrb_dvalu", header: "Default Value", width: "150px" },
    {
      key: "attrb_actve",
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
          actve={row.attrb_actve}
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
      exportFilename="attributes-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No attributes found"
    />
  );
};
export default AttrbList;
