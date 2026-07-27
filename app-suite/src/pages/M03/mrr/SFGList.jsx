import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const SFGList = ({ readOnly, listData, onEdit, onDelete, onAdd }) => {
  const dtColumns = [
    { key: "bosfg_types", header: "Type", width: "100px" },
    { key: "items_iname", header: "Item", width: "200px" },
    { key: "bosfg_group", header: "Group", width: "80px" },
    {
      key: "bosfg_fgqty",
      header: "Quantity",
      width: "80px",
      render: (_, row) => {
        return (
          <span>
            {row.bosfg_fgqty} {row.units_cname}
          </span>
        );
      },
    },
    { key: "bosfg_fgrto", header: "Ratio", width: "80px" },
    { key: "bosfg_fgrat", header: "Rate", width: "80px" },
    { key: "bosfg_fgval", header: "Value", width: "80px" },
    { key: "bosfg_notes", header: "Notes", width: "100px" },
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
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>Output → SFG/FG</p>
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
        emptyMessage="No SFG/FG found"
        className="mt-2"
      />
    </>
  );
};
export default SFGList;
