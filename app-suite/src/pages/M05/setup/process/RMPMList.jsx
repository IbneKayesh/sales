import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const RMPMList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prrpm_types", header: "Type", width: "80px" },
    { key: "items_iname", header: "Item", width: "200px" },
    {
      key: "prrpm_rmqty",
      header: "Quantity",
      width: "80px",
      render: (_, row) => {
        return (
          <span>
            {row.prrpm_rmqty} {row.units_cname}
          </span>
        );
      },
    },
    { key: "prrpm_rmrto", header: "Ratio", width: "80px" },
    { key: "prrpm_rmrat", header: "Rate", width: "80px" },
    { key: "prrpm_rmval", header: "Value", width: "80px" },
    { key: "prrpm_prqty", header: "Proc Qty", width: "80px" },
    { key: "prrpm_prval", header: "Proc Val", width: "80px" },
    { key: "prrpm_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.prrpm_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
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
      emptyMessage="No raw materials found"
      className="mt-2"
    />
  );
};
export default RMPMList;
