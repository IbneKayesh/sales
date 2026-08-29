import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const FOHList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prfoh_itype", header: "Type", width: "80px" },
    { key: "price_cname", header: "Item", width: "200px" },
    {
      key: "prfoh_boqty",
      header: "BOM Qty",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.prfoh_boqty} x {row.prfoh_borat} {row.units_cname}
          </span>
        );
      },
    },
    { key: "prfoh_foqty", header: "Qty", width: "80px" },
    { key: "prfoh_forat", header: "Rate", width: "80px" },
    { key: "prfoh_foval", header: "Value", width: "80px" },
    { key: "prfoh_notes", header: "Notes", width: "80px" },
    { key: "prfoh_stock", header: "Stock", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.prfoh_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>Input → FOH</p>
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
        emptyMessage="No factory overhead found"
        className="mt-2"
      />
    </>
  );
};
export default FOHList;
