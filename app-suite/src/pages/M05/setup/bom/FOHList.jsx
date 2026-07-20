import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose, IconCheck, IconPlus } from "@/icons";

const FOHList = ({ listData, onEdit, onDelete, onAdd }) => {
  const dtColumns = [
    { key: "bofoh_items", header: "Item", width: "200px" },
    { key: "bofoh_types", header: "Type", width: "100px" },
    { key: "bofoh_rmqty", header: "Quantity", width: "100px" },
    { key: "bofoh_rmrto", header: "Ratio", width: "100px" },
    { key: "bofoh_rmrat", header: "Rate", width: "100px" },
    { key: "bofoh_rmval", header: "Value", width: "100px" },
    {
      key: "bofoh_actve",
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
          actve={row.bofoh_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
  return (
    <div>
      <div className="data-table__toolbar" style={{ justifyContent: "flex-end", marginBottom: "8px" }}>
        <Button size="sm" onClick={onAdd}>
          <IconPlus size={14} className="icon-left" />
          Add
        </Button>
      </div>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={5}
        sortable
        striped
        hoverable
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No factory overhead items found"
      />
    </div>
  );
};
export default FOHList;
