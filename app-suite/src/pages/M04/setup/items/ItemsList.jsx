import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose, IconCheck, IconDollar } from "@/icons";

const ItemsList = ({ listData, onEdit, onDelete, onPrice }) => {
  const dtColumns = [
    { key: "items_icode", header: "Code", width: "120px" },
    { key: "items_iname", header: "Item Name", width: "200px" },
    { key: "items_brcod", header: "Barcode", width: "140px" },
    { key: "items_itype", header: "Type", width: "80px" },
    { key: "items_brand", header: "Brand", width: "120px" },
    {
      key: "items_actve",
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
      width: "150px",
      sortable: false,
      render: (_, row) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPrice(row);
            }}
            title="Prices"
          >
            <IconDollar size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.items_actve}
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
      exportFilename="items-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No items found"
    />
  );
};
export default ItemsList;
