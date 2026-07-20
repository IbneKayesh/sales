import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const RawMaterialList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "borpm_items", header: "Item", width: "200px" },
    { key: "borpm_types", header: "Type", width: "100px" },
    { key: "borpm_rmqty", header: "Quantity", width: "100px" },
    { key: "borpm_rmrto", header: "Ratio", width: "100px" },
    { key: "borpm_rmrat", header: "Rate", width: "100px" },
    { key: "borpm_rmval", header: "Value", width: "100px" },
    {
      key: "borpm_actve",
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
          actve={row.borpm_actve}
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
      exportFilename="raw-materials-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No raw materials found"
    />
  );
};
export default RawMaterialList;
