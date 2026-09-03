import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import { validNumber } from "@/utils/misc.js";

const ItemBundleList = ({ readOnly, listData, onDelete }) => {
  const dtColumns = [
    {
      key: "bndlm_cname",
      header: "Bundle",
      width: "80px",
    },
    {
      key: "bndlm_price_cname",
      header: "Bundle Item",
      width: "80px",
    },
    {
      key: "invcf_bnqty",
      header: "Bundle Qty",
      width: "80px",
      align: "right",
      body: (_, row) => {
        return <span>{validNumber(row.invcf_bnqty)}</span>;
      },
    },
    {
      key: "bndlm_units_cname",
      header: "Bundle Unit",
      width: "80px",
    },
    {
      key: "price_cname",
      header: "Package Item",
      width: "80px",
    },
    {
      key: "invcf_pkqty",
      header: "Package Qty",
      width: "80px",
      align: "right",
      body: (_, row) => {
        return <span>{validNumber(row.invcf_pkqty)}</span>;
      },
    },
    {
      key: "bndlc_itrat",
      header: "Package Rate",
      width: "80px",
      body: (_, row) => {
        return (
          <span>
            {validNumber(row.bndlc_itrat) === 0
              ? "Free"
              : "@ " + validNumber(row.bndlc_itrat)}
          </span>
        );
      },
    },
    {
      key: "units_cname",
      header: "Package Unit",
      width: "80px",
    },
    {
      key: "invcf_trqty",
      header: "Purchase Qty",
      width: "80px",
    },
    {
      key: "invcf_ofcnt",
      header: "Offer Qty",
      width: "80px",
    },
    {
      key: "invcf_ofqty",
      header: "Package Qty",
      width: "80px",
    },
    {
      key: "stock_ohqty",
      header: "Stock Qty",
      width: "80px",
    },
  ];

  return (
    <>
      <p>(Free Bundles)</p>
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
        cfColumns={[]}
      />
    </>
  );
};
export default ItemBundleList;
