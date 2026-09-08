import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import ConvertUOM from "@/components/common/ConvertUOM";

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
      footer: (_, row) => {
        return listData.length + " lines";
      },
    },
    {
      key: "invcc_itrat",
      header: "Rate * Qty",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {Number(rowData.invcc_itrat).toFixed(4)} x{" "}
            {Number(rowData.invcc_itqty).toFixed(4)} {rowData.runit_uname} ={" "}
            {Number(rowData.invcc_itamt).toFixed(4)}
          </>
        );
      },
      footer: (_, row) => {
        return (
          row.reduce((sum, row) => sum + Number(row.invcc_itqty ?? 0), 0) +
          " = " +
          row.reduce((sum, row) => sum + Number(row.invcc_itamt ?? 0), 0)
        );
      },
    },
    {
      key: "invcc_dsamt",
      header: "Discount",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {Number(rowData.invcc_dsamt).toFixed(4)} ({rowData.invcc_dspct}%)
            [Other: {rowData.invcc_edamt}]
          </>
        );
      },
    },
    {
      key: "invcc_vtpct",
      header: "VAT",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {rowData.invcc_vtamt} ({rowData.invcc_vtpct}% {rowData.invcc_vtype})
          </>
        );
      },
    },
    {
      key: "invcc_icamt",
      header: "In Cost",
      width: "80px",
    },
    {
      key: "invcc_ecamt",
      header: "Ex Cost",
      width: "80px",
    },
    {
      key: "invcc_pyamt",
      header: "Payable",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.invcc_pyamt) || 0).toFixed(4)}</>;
      },
    },
    {
      key: "invcc_stamt",
      header: "Sub Total",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.invcc_stamt) || 0).toFixed(4)}</>;
      },
    },
    { key: "invcc_notes", header: "Notes", width: "100px" },
    {
      key: "invcc_csrat",
      header: "Unit Cost",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.invcc_csrat) || 0).toFixed(4)}</>;
      },
    },
    {
      key: "invcc_nsrat",
      header: "Net Unit Cost",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.invcc_nsrat) || 0).toFixed(4)}</>;
      },
    },
    {
      key: "punit_cname",
      header: "Pack",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            <ConvertUOM
              qty={rowData.invcc_itqty}
              dfQty={rowData.items_pkqty}
              runit={rowData.runit_cname}
              punit={rowData.punit_cname}
            />
          </>
        );
      },
    },
    {
      key: "sunit_cname",
      header: "Size",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            <ConvertUOM
              qty={rowData.invcc_itqty}
              dfQty={rowData.items_szqty}
              runit={rowData.runit_cname}
              punit={rowData.sunit_cname}
            />
          </>
        );
      },
    },
    { key: "sgrup_cname", header: "sGroup", width: "80px" },
    { key: "scatg_cname", header: "sCategory", width: "80px" },
    { key: "brand_cname", header: "Brand", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.invcc_actve}
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
      <p>(Items → SVC/FG)</p>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={50}
        showRows={false}
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
