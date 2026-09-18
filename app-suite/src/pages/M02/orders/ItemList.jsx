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
      footer: (_, row) => {
        return listData.length + " lines";
      },
    },
    { key: "items_iname", header: "Item", width: "80px" },
    {
      key: "odrdc_itrat",
      header: "Rate * Qty",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {formatNumber(rowData.odrdc_itrat)} x{" "}
            {formatNumber(rowData.odrdc_itqty)} {rowData.runit_cname} ={" "}
            {formatNumber(rowData.odrdc_itamt)}
          </>
        );
      },
      footer: (_, row) => {
        return (
          row.reduce((sum, row) => sum + Number(row.odrdc_itqty ?? 0), 0) +
          " = " +
          row.reduce((sum, row) => sum + Number(row.odrdc_itamt ?? 0), 0)
        );
      },
    },
    {
      key: "odrdc_dsamt",
      header: "Discount",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {formatNumber(rowData.odrdc_dsamt)} (
            {formatNumber(rowData.odrdc_dspct)}%) [Other:{" "}
            {formatNumber(rowData.odrdc_edamt)}]
          </>
        );
      },
    },
    {
      key: "odrdc_vtpct",
      header: "VAT",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {formatNumber(rowData.odrdc_vtamt)} (
            {formatNumber(rowData.odrdc_vtpct)}% {rowData.odrdc_vtype})
          </>
        );
      },
    },
    {
      key: "odrdc_icamt",
      header: "In Cost",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "odrdc_ecamt",
      header: "Ex Cost",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "odrdc_pyamt",
      header: "Payable",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    {
      key: "odrdc_stamt",
      header: "Sub Total",
      width: "80px",
      body: (v) => formatNumber(v),
    },
    { key: "odrdc_notes", header: "Notes", width: "100px" },
    {
      key: "odrdc_csrat",
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
              qty={rowData.odrdc_itqty}
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
              qty={rowData.odrdc_itqty}
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
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.odrdc_actve}
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
