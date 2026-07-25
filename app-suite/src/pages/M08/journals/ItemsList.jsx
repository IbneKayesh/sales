import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const ItemsList = ({ readOnly, listData, onEdit, onDelete }) => {
  const totalDr = listData.reduce(
    (sum, item) => sum + (Number(item.jrnlc_drval) || 0),
    0,
  );
  const totalCr = listData.reduce(
    (sum, item) => sum + (Number(item.jrnlc_crval) || 0),
    0,
  );

  const dtColumns = [
    {
      key: "chtac_cname",
      header: "Account",
      width: "80px",
    },
    { key: "party_cname", header: "Party", width: "80px" },
    {
      key: "jrnlc_drval",
      header: "Debit",
      width: "80px",
      render: (v) => v?.toLocaleString?.() || "0",
    },
    {
      key: "jrnlc_crval",
      header: "Credit",
      width: "80px",
      render: (v) => v?.toLocaleString?.() || "0",
    },
    { key: "jrnlc_descr", header: "Description", width: "200px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.jrnlc_actve}
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
      searchable={false}
      striped
      hoverable
      exportable={false}
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No journal lines added yet"
      className="mt-2"
    />
  );
};
export default ItemsList;
