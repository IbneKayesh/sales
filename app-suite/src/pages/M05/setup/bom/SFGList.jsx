import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const SFGList = ({ readOnly, listData, onEdit, onDelete, onAdd }) => {
  const dtColumns = [
    { key: "bosfg_itype", header: "Type", width: "100px" },
    { key: "price_cname", header: "Item", width: "200px" },
    { key: "bosfg_group", header: "Group", width: "80px" },
    {
      key: "bosfg_fgqty",
      header: "Quantity",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.bosfg_fgqty} {row.units_cname}
          </span>
        );
      },
    },
    { key: "bosfg_fgrto", header: "Qty Ratio", width: "80px" },
    { key: "bosfg_fgrat", header: "Rate", width: "80px" },
    { key: "bosfg_fgval", header: "Value", width: "80px" },
    { key: "bosfg_rtrto", header: "Cost Ratio", width: "80px" },
    { key: "bosfg_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.bosfg_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>Output → SFG/FG</p>
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
export default SFGList;
