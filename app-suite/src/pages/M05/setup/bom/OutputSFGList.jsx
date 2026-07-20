import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose, IconCheck, IconPlus } from "@/icons";

const OutputSFGList = ({ listData, onEdit, onDelete, onAdd }) => {
  const dtColumns = [
    { key: "bosfg_items", header: "Item", width: "200px" },
    { key: "bosfg_types", header: "Type", width: "100px" },
    { key: "bosfg_inout", header: "I/O", width: "80px" },
    { key: "bosfg_group", header: "Group", width: "100px" },
    { key: "bosfg_rmqty", header: "Quantity", width: "100px" },
    { key: "bosfg_rmrto", header: "Ratio", width: "100px" },
    { key: "bosfg_rmrat", header: "Rate", width: "100px" },
    { key: "bosfg_rmval", header: "Value", width: "100px" },
    {
      key: "bosfg_actve",
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
          actve={row.bosfg_actve}
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
        emptyMessage="No output SFG/FG items found"
      />
    </div>
  );
};
export default OutputSFGList;
