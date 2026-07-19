import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const ScatgList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "scatg_ccode", header: "Code", width: "120px" },
    { key: "scatg_mcatg", header: "Main Category", width: "180px" },
    { key: "scatg_cname", header: "Sub Category Name", width: "200px" },
    {
      key: "scatg_actve",
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
          actve={row.scatg_actve}
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
      exportFilename="sub-categories-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No sub categories found"
    />
  );
};
export default ScatgList;
