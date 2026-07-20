import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const RMPMList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "borpm_types", header: "Type", width: "80px" },
    { key: "items_iname", header: "Item", width: "200px" },
    {
      key: "borpm_rmqty",
      header: "Quantity",
      width: "80px",
      render: (_, row) => {
        return (
          <span>
            {row.borpm_rmqty} {row.units_cname}
          </span>
        );
      },
    },
    { key: "borpm_rmrto", header: "Ratio", width: "80px" },
    { key: "borpm_rmrat", header: "Rate", width: "80px" },
    { key: "borpm_rmval", header: "Value", width: "80px" },
    { key: "borpm_notes", header: "Notes", width: "100px" },
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
export default RMPMList;
