import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose, IconCheck, IconBar } from "@/icons";

const McatgList = ({
  listData,
  onEdit,
  onDelete,
  onSubCategory,
  onAttributes,
}) => {
  const dtColumns = [
    { key: "mcatg_ccode", header: "Code", width: "180px" },
    { key: "mcatg_cname", header: "Category Name", width: "200px" },
    {
      key: "mcatg_actve",
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
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSubCategory(row);
            }}
            title="Sub Categories"
          >
            <IconBar size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAttributes(row);
            }}
            title="Attributes"
          >
            <IconBar size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.mcatg_actve}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
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
      emptyMessage="No main categories found"
    />
  );
};
export default McatgList;
