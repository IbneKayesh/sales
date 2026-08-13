import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const SectionList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "sectn_ccode", header: "Code", width: "80px" },
    { key: "sectn_cname", header: "Name", width: "80px" },
    { key: "dpart_cname", header: "Department", width: "80px" },
    { key: "sectn_ofadr", header: "Office Address", width: "80px" },
    { key: "sectn_emcap", header: "Emp Capacity", width: "80px" },
    {
      key: "sectn_actve",
      header: "Status",
      width: "110px",
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
          actve={row.sectn_actve}
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
      exportFilename="sections-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No sections found"
    />
  );
};
export default SectionList;
