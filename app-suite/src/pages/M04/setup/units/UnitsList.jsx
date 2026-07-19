import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import {
  IconClose,
  IconCheck,
} from "@/icons";

const UnitsList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "units_ccode", header: "Code", width: "120px" },
    { key: "units_cname", header: "Unit Name", width: "200px" },
    { key: "units_untgr", header: "Unit Group", width: "180px" },
    {
      key: "units_actve",
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
          actve={row.units_actve}
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
      exportFilename="units-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No units found"
    />
  );
};
export default UnitsList;
