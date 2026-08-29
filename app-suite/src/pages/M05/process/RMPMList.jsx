import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const RMPMList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prrpm_itype", header: "Type", width: "80px" },
    { key: "price_cname", header: "Item", width: "200px" },
    {
      key: "prrpm_boqty",
      header: "BOM Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.prrpm_boqty} x {row.prrpm_borat} {row.units_cname}
          </span>
        );
      },
    },
    { key: "prrpm_rmqty", header: "Qty", width: "80px" },
    { key: "prrpm_rmrat", header: "Rate", width: "80px" },
    { key: "prrpm_rmval", header: "Value", width: "80px" },
    { key: "prrpm_notes", header: "Notes", width: "80px" },
    // { key: "prrpm_stock", header: "Stock", width: "80px" },
    { key: "stock_ohqty", header: "Stock", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
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
    <>
      <p>Input → RM/PM/SFG/FG</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={15}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        className="mt-2"
      />
    </>
  );
};
export default RMPMList;
