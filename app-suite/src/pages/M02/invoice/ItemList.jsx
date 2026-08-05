import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

const ItemList = ({ readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "items_iname",
      header: "Item",
      width: "200px",
      render: (_, row) => {
        return (
          <span>
            {row.items_iname} - {row.items_szqty} {row.sunit_cname}
          </span>
        );
      },
    },
    {
      key: "invcc_itrat",
      header: "Rate * Qty",
      width: "80px",
      render: (_, rowData) => {
        return (
          <>
            {Number(rowData.invcc_itrat).toFixed(4)} x{" "}
            {Number(rowData.invcc_itqty).toFixed(4)} {rowData.runit_uname} ={" "}
            {Number(rowData.invcc_itamt).toFixed(4)}
          </>
        );
      },
    },
    {
      key: "invcc_dsamt",
      header: "Discount",
      width: "100px",
      render: (_, rowData) => {
        return (
          <>
            [{rowData.invcc_edamt}] {Number(rowData.invcc_dsamt).toFixed(4)} (
            {rowData.invcc_dspct}%)
          </>
        );
      },
    },
    {
      key: "invcc_vtpct",
      header: "VAT",
      width: "100px",
      render: (_, rowData) => {
        return (
          <>
            {rowData.invcc_vtamt} ({rowData.invcc_vtpct}%)
          </>
        );
      },
    },
    {
      key: "invcc_fcamt",
      header: "Fix Cost",
      width: "100px",
      render: (_, rowData) => {
        return <>{Number(rowData.invcc_fcamt) || 0}</>;
      },
    },
    {
      key: "invcc_icamt",
      header: "Other Cost",
      width: "80px",
      render: (_, rowData) => {
        return (
          <>
            {(
              Number(rowData.invcc_icamt || 0) +
              Number(rowData.invcc_ecamt || 0)
            ).toFixed(4)}
          </>
        );
      },
    },
    {
      key: "invcc_ntamt",
      header: "Sub Total",
      width: "80px",
      render: (_, rowData) => {
        return <>{(Number(rowData.invcc_ntamt) || 0).toFixed(4)}</>;
      },
    },
    { key: "invcc_notes", header: "Notes", width: "100px" },
    {
      key: "invcc_csrat",
      header: "Unit Cost",
      width: "80px",
      render: (_, rowData) => {
        return <>{(Number(rowData.invcc_csrat) || 0).toFixed(4)}</>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.invcc_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];
  return (
    <>
      <p>(Items → RM/PM/FG)</p>
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
export default ItemList;
