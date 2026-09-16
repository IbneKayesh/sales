import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import ConvertUOM from "@/components/common/ConvertUOM";
import ConvertSize from "@/components/common/ConvertSize";
import { formatNumber } from "@/utils/misc";

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
            {row.price_cname} - {formatNumber(row.items_szqty)}{" "}
            {row.sunit_cname}
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
      key: "pordc_itrat",
      header: "Rate * Qty",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {formatNumber(rowData.pordc_itrat)} x{" "}
            {formatNumber(rowData.pordc_itqty)} {rowData.runit_cname} ={" "}
            {formatNumber(rowData.pordc_itamt)}
          </>
        );
      },
      footer: (_, row) => {
        return (
          formatNumber(
            row.reduce((sum, row) => sum + Number(row.pordc_itqty ?? 0), 0),
          ) +
          " = " +
          formatNumber(
            row.reduce((sum, row) => sum + Number(row.pordc_itamt ?? 0), 0),
          )
        );
      },
    },
    {
      key: "pordc_dsamt",
      header: "Discount",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {formatNumber(rowData.pordc_dsamt)} (
            {formatNumber(rowData.pordc_dspct)}%)
          </>
        );
      },
    },
    {
      key: "pordc_vtpct",
      header: "VAT",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {formatNumber(rowData.pordc_vtamt)} (
            {formatNumber(rowData.pordc_vtpct)}% {rowData.pordc_vtype})
          </>
        );
      },
    },
    {
      key: "pordc_icamt",
      header: "In Cost",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "pordc_ecamt",
      header: "Ex Cost",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "pordc_pyamt",
      header: "Payable",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "pordc_stamt",
      header: "Sub Total",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    { key: "pordc_notes", header: "Notes", width: "100px" },
    {
      key: "pordc_csrat",
      header: "Unit Cost",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "punit_cname",
      header: "Pack",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            <ConvertUOM
              qty={rowData.pordc_itqty}
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
            <ConvertSize
              qty={rowData.pordc_itqty}
              dfQty={rowData.items_szqty}
              sunit={rowData.sunit_cname}
            />
          </>
        );
      },
    },
    { key: "sgrup_cname", header: "sGroup", width: "80px" },
    { key: "scatg_cname", header: "sCategory", width: "80px" },
    { key: "brand_cname", header: "Brand", width: "80px" },
    {
      key: "pordc_mrqty",
      header: "MRR Qty",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "pordc_mrpnd",
      header: "MRR Pending",
      width: "80px",
      body: (_, rowData) => {
        return <>{formatNumber(rowData.pordc_itqty - rowData.pordc_mrqty)}</>;
      },
    },
    {
      key: "pordc_cnqty",
      header: "Cancelled Qty",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.pordc_actve}
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
