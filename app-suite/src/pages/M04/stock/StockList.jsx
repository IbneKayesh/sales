import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import NegativeValue from "@/components/common/NegativeValue";
import { IconClose, IconCheck } from "@/icons";

const StockList = ({ listData, onEdit, onDelete }) => {
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
      render: (_, row) => <NegativeValue value={row.price_dprat} />,
    },
    {
      key: "price_mrrat",
      header: "MRP",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_dprat} />,
    },
    {
      key: "price_dspct",
      header: "Discount",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.price_dprat} />,
    },
    { key: "price_gdstk", header: "Good Stock", width: "80px" },
    { key: "price_bdstk", header: "Bad Stock", width: "80px" },
    { key: "price_mnqty", header: "Min Qty", width: "80px" },
    { key: "price_mxqty", header: "Max Qty", width: "80px" },
    { key: "price_pbqty", header: "Purchase Booking", width: "80px" },
    { key: "price_sbqty", header: "Sales Booking", width: "80px" },
    { key: "price_notes", header: "Notes", width: "80px" },
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
      emptyMessage="No data found"
      autofit
    />
  );
};
export default StockList;
