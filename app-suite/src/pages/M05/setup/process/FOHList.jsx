import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const FOHList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prfoh_types", header: "Type", width: "80px" },
    { key: "items_iname", header: "Item", width: "200px" },
    {
      key: "prfoh_foqty",
      header: "Quantity",
      width: "80px",
      render: (_, row) => {
        return (
          <span>
            {row.prfoh_foqty} {row.units_cname}
          </span>
        );
      },
    },
    { key: "prfoh_forto", header: "Ratio", width: "80px" },
    { key: "prfoh_forat", header: "Rate", width: "80px" },
    { key: "prfoh_foval", header: "Value", width: "80px" },
    { key: "prfoh_prqty", header: "Proc Qty", width: "80px" },
    { key: "prfoh_prval", header: "Proc Val", width: "80px" },
    { key: "prfoh_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
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
        pageSize={10}
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
