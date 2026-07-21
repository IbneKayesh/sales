import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const BatchList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "prbtc_types", header: "Type", width: "80px" },
    { key: "items_iname", header: "Item", width: "200px" },
    { key: "prbtc_group", header: "Group", width: "80px" },
    { key: "prbtc_batch", header: "Batch No", width: "100px" },
    {
      key: "prbtc_gaqty",
      header: "Good A",
      width: "80px",
      render: (_, row) => {
        return (
          <span>
            {row.prbtc_gaqty} {row.units_cname}
          </span>
        );
      },
    },
    {
      key: "prbtc_gbqty",
      header: "Good B",
      width: "80px",
      render: (_, row) => {
        return (
          <span>
            {row.prbtc_gbqty} {row.units_cname}
          </span>
        );
      },
    },
    { key: "prbtc_rjqty", header: "Reject", width: "80px" },
    { key: "prbtc_pbrat", header: "Rate", width: "80px" },
    { key: "prbtc_pbval", header: "Value", width: "80px" },
    { key: "prbtc_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.prbtc_actve}
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
      emptyMessage="No batch records found"
      className="mt-2"
    />
  );
};
export default BatchList;
