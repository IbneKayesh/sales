import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const RMPMList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "borpm_itype", header: "Type", width: "80px" },
    { key: "price_cname", header: "Item", width: "200px" },
    {
      key: "borpm_rmqty",
      header: "Quantity",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {row.borpm_rmqty} {row.runit_cname}
          </span>
        );
      },
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.borpm_rmqty ?? 0), 0);
      },
    },
    { key: "borpm_rmrto", header: "Ratio", width: "80px" },
    { key: "borpm_rmrat", header: "Rate", width: "80px" },
    { key: "borpm_rmval", header: "Value", width: "80px" },
    { key: "borpm_notes", header: "Notes", width: "100px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.borpm_actve}
          //onEdit={onEdit}
          onCopy={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>Input → RM/PM/WIP/FG</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={25}
        showPageSize={false}
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
