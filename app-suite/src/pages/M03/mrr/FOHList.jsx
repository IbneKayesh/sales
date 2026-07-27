import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const FOHList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "items_iname", header: "Item", width: "200px" },
    { key: "mrrdc_trate", header: "Rate", width: "80px" },
    { key: "mrrdc_trqty", header: "Qty", width: "80px" },
    { key: "mrrdc_tramt", header: "Amount", width: "100px" },
    { key: "mrrdc_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.mrrdc_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>Input → Items</p>
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
        emptyMessage="No items found"
        className="mt-2"
      />
    </>
  );
};
export default FOHList;
