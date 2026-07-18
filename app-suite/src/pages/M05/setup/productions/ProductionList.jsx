import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import {
  IconClose,
  IconPlus,
  IconEdit,
  IconDelete,
  IconCheck,
  IconSave,
  IconWarning,
  IconInfo,
} from "@/icons";

const ProductionList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prods_ccode", header: "Code", width: "180px" },
    { key: "prods_cname", header: "Name", width: "180px" },
    { key: "prods_prono", header: "Production No", width: "180px" },
    {
      key: "prods_actve",
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
        <span className="d-inline-flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title="Edit"
          >
            <IconEdit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="btn--icon-danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            title="Delete"
          >
            <IconDelete size={14} />
          </Button>
        </span>
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
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
    />
  );
};
export default ProductionList;
