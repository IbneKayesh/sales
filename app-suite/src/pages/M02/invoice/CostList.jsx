import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const CostList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "party_cname", header: "Cost Name", width: "200px" },
    { key: "invcs_csmod", header: "Cost Mode", width: "80px" },
    { key: "invcs_value", header: "Amount", width: "100px" },
    { key: "invcs_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.invcs_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p className="mt-2">(Costing → Include/Exclude)</p>
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
        emptyMessage="No items found"
        className="mt-2"
      />
    </>
  );
};
export default CostList;
