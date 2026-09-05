import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";

// Column visibility is configured in M01 SetupPage and passed in as params
// (cfColumns). No storage read/write happens here.
const ItemList = ({ cfColumns = [], readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "price_cname",
      header: "Name",
      width: "200px",
      body: (_, row) => {
        return (
          <span>
            {row.price_cname} - {row.items_szqty} {row.sunit_cname}
          </span>
        );
      },
    },
    {
      key: "items_iname",
      header: "Item",
      width: "80px",
    },
    {
      key: "mrrdc_itrat",
      header: "Rate * Qty",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {Number(rowData.mrrdc_itrat).toFixed(4)} x{" "}
            {Number(rowData.mrrdc_itqty).toFixed(4)} {rowData.runit_uname} ={" "}
            {Number(rowData.mrrdc_itamt).toFixed(4)}
          </>
        );
      },
    },
    {
      key: "mrrdc_dsamt",
      header: "Discount",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {Number(rowData.mrrdc_dsamt).toFixed(4)} ({rowData.mrrdc_dspct}%)
            [Other: {rowData.mrrdc_edamt}]
          </>
        );
      },
    },
    {
      key: "mrrdc_vtpct",
      header: "VAT",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {rowData.mrrdc_vtamt} ({rowData.mrrdc_vtpct}% {rowData.mrrdc_vtype})
          </>
        );
      },
    },
    {
      key: "mrrdc_icamt",
      header: "In Cost",
      width: "80px",
    },
    {
      key: "mrrdc_ecamt",
      header: "Ex Cost",
      width: "80px",
    },
    {
      key: "mrrdc_pyamt",
      header: "Payable",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.mrrdc_pyamt) || 0).toFixed(4)}</>;
      },
    },
    {
      key: "mrrdc_stamt",
      header: "Sub Total",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.mrrdc_stamt) || 0).toFixed(4)}</>;
      },
    },
    { key: "mrrdc_notes", header: "Notes", width: "100px" },
    {
      key: "mrrdc_csrat",
      header: "Unit Cost",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.mrrdc_csrat) || 0).toFixed(4)}</>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.mrrdc_actve}
          onCopy={onEdit}
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
        pageSize={50}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        className="mt-2"
        cfColumns={cfColumns}
      />
    </>
  );
};
export default ItemList;
