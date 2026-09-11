import DataTable from "@/components/DataTable";
import NegativeValue from "@/components/common/NegativeValue";
import { getRelativeDays, formatDate } from "@/utils/datetime.js";
import ConvertUOM from "@/components/common/ConvertUOM";
import Badge from "@/components/Badge";

const StockList = ({ cfColumns = [], listData, onEdit }) => {
  const dtColumns = [
    { key: "price_cname", header: "Name", width: "80px" },
    { key: "items_iname", header: "Item", width: "80px" },
    { key: "runit_cname", header: "Unit", width: "80px" },
    { key: "stock_sorce", header: "Source", width: "80px" },
    { key: "stock_trnno", header: "Trn", width: "80px" },
    {
      key: "stock_trdat",
      header: "Date",
      width: "80px",
      body: (v) => getRelativeDays(v),
    },
    { key: "stock_brcod", header: "Barcode", width: "80px" },
    { key: "stock_batch", header: "Batch", width: "80px" },
    { key: "stock_srial", header: "Serial", width: "80px" },
    {
      key: "stock_wrdat",
      header: "Warranty Date",
      width: "80px",
      body: (v) => formatDate(v),
    },
    {
      key: "stock_fgdat",
      header: "MFG Date",
      width: "80px",
      body: (v) => formatDate(v),
    },
    {
      key: "stock_exdat",
      header: "Expiry Date",
      width: "80px",
      body: (v) => formatDate(v),
    },
    {
      key: "stock_trqty",
      header: "TR.Qty",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_trqty} />,
    },
    {
      key: "stock_rtqty",
      header: "RT.Qty",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_rtqty} />,
    },
    {
      key: "stock_slqty",
      header: "Sales",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_slqty} />,
    },
    {
      key: "stock_isqty",
      header: "Issue",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_isqty} />,
    },
    {
      key: "stock_rcqty",
      header: "Receive",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_rcqty} />,
    },
    {
      key: "stock_cnqty",
      header: "Consumption",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_cnqty} />,
    },
    {
      key: "stock_dmqty",
      header: "Damage",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_dmqty} />,
    },
    {
      key: "stock_aiqty",
      header: "Adjust In",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_aiqty} />,
    },
    {
      key: "stock_aoqty",
      header: "Adjust Out",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_aoqty} />,
    },
    {
      key: "stock_ohqty",
      header: "OHQ",
      width: "80px",
      body: (_, row) => (
        <>
          <NegativeValue value={row.stock_ohqty} /> {row.runit_cname}
        </>
      ),
    },
    {
      key: "punit_cname",
      header: "Pack",
      width: "80px",
      body: (_, row) => {
        return (
          <>
            <ConvertUOM
              qty={row.stock_ohqty}
              dfQty={row.items_pkqty}
              runit={row.runit_cname}
              punit={row.punit_cname}
            />
          </>
        );
      },
    },
    {
      key: "sunit_cname",
      header: "Size",
      width: "80px",
      body: (_, row) => {
        return (
          <>
            <ConvertUOM
              qty={row.stock_ohqty}
              dfQty={row.items_szqty}
              runit={row.runit_cname}
              punit={row.sunit_cname}
            />
          </>
        );
      },
    },
    {
      key: "stock_cprat",
      header: "CP",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_cprat} />,
    },
    {
      key: "stock_dprat",
      header: "DP",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_dprat} />,
    },
    {
      key: "stock_tprat",
      header: "TP",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_tprat} />,
    },
    {
      key: "stock_mrrat",
      header: "MRP",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_mrrat} />,
    },
    {
      key: "stock_lprat",
      header: "LP",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.stock_lprat} />,
    },
    {
      key: "stock_value",
      header: "Value",
      width: "80px",
      body: (_, row) => {
        return (
          <>
            <NegativeValue value={row.stock_ohqty * row.stock_cprat} />
          </>
        );
      },
      footer: (_, row) => {
        return row.reduce(
          (sum, row) =>
            sum + Number(row.stock_ohqty ?? 0) * Number(row.stock_cprat ?? 0),
          0,
        );
      },
    },
    {
      key: "stock_notes",
      header: "Notes",
      width: "80px",
    },
    { key: "sgrup_cname", header: "sGroup", width: "80px" },
    { key: "scatg_cname", header: "sCategory", width: "80px" },
    { key: "brand_cname", header: "Brand", width: "80px" },
  ];
  return (
    <>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={25}
        sortable
        searchable
        striped
        hoverable
        exportable
        exportFilename="data-export.csv"
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
        autofit
        cfColumns={cfColumns}
      />

      <Badge variant="info" dot="true" className="mt-2">
        Click to select line stock: Merge multiple stock lines of the same item
        into a single line stock.
      </Badge>
    </>
  );
};
export default StockList;
