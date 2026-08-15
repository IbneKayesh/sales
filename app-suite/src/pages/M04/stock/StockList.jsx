import DataTable from "@/components/DataTable";
import NegativeValue from "@/components/common/NegativeValue";

const StockList = ({ cfColumns = [], listData, onEdit }) => {
  const dtColumns = [
    { key: "price_cname", header: "Name", width: "80px" },
    {
      key: "price_lprat",
      header: "LPR",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_lprat} />,
    },
    {
      key: "price_dprat",
      header: "DPR",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_dprat} />,
    },
    {
      key: "price_tprat",
      header: "TPR",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_tprat} />,
    },
    {
      key: "price_mrrat",
      header: "MRP",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_mrrat} />,
    },
    {
      key: "price_dspct",
      header: "Discount",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_dspct} />,
    },
    {
      key: "price_gdstk",
      header: "Good Stock",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_gdstk} />,
    },
    {
      key: "price_bdstk",
      header: "Bad Stock",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_bdstk} />,
    },
    {
      key: "stock_ohqty",
      header: "OHQ",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.stock_ohqty} />,
    },
    {
      key: "price_mnqty",
      header: "Min Qty",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_mnqty} />,
    },
    {
      key: "price_mxqty",
      header: "Max Qty",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_mxqty} />,
    },
    {
      key: "price_pbqty",
      header: "Purchase Booking",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_pbqty} />,
    },
    {
      key: "price_sbqty",
      header: "Sales Booking",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_sbqty} />,
    },
    {
      key: "price_notes",
      header: "Notes",
      width: "80px",
    },
  ];
  return (
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
  );
};
export default StockList;
