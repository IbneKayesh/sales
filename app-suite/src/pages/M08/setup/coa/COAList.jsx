import DataTable from "@/components/DataTable";
import { IconCheck, IconClose } from "@/icons";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";

const COAList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "parnt_cname", header: "Parent", width: "180px" },
    { key: "chtac_cname", header: "Name", width: "180px" },
    { key: "chtac_ctype", header: "Type", width: "180px" },
    { key: "chtac_chtno", header: "Chart No", width: "140px" },
    { key: "chtac_ntype", header: "Nature Type", width: "120px" },
    {
      key: "chtac_child",
      header: "Child",
      width: "100px",
      render: (v) => (
        <Badge
          variant={v ? "success" : "muted"}
          icon={v ? <IconCheck size={12} /> : <IconClose size={12} />}
        >
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "chtac_ispst",
      header: "Postable",
      width: "120px",
      render: (v) => (
        <Badge
          variant={v ? "success" : "danger"}
          icon={v ? <IconCheck size={12} /> : <IconClose size={12} />}
        >
          {v ? "Allowed" : "Not Allowed"}
        </Badge>
      ),
    },
    {
      key: "chtac_actve",
      header: "Status",
      width: "100px",
      render: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.chtac_actve}
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
      pageSize={50}
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
export default COAList;
