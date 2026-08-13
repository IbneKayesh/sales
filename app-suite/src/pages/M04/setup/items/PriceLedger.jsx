import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import NegativeValue from "@/components/common/NegativeValue";
import { formatDate } from "@/utils/datetime.js";

const PriceLedger = ({ listData }) => {
  const dtColumns = [
    { key: "cntct_cname", header: "Contact", width: "200px" },
    { key: "mrrdm_trnno", header: "Trn", width: "200px" },
    {
      key: "mrrdm_trdat",
      header: "Date",
      width: "200px",
      render: (_, row) => <>{formatDate(row.mrrdm_trdat)}</>,
    },
    { key: "items_iname", header: "Item", width: "200px" },
    { key: "price_cname", header: "Price", width: "200px" },
    {
      key: "mrrdc_itqty",
      header: "Qty",
      width: "80px",
      render: (_, row) => (
        <>
          <NegativeValue value={row.mrrdc_itqty} /> {row.units_cname}
        </>
      ),
    },
    {
      key: "mrrdc_csrat",
      header: "Cost Price",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.mrrdc_csrat} />,
    },
    {
      key: "line_value",
      header: "Value",
      width: "80px",
      render: (_, row) => <NegativeValue value={row.line_value} />,
    },
    // {
    //   key: "line_value",
    //   header: "Value",
    //   width: "80px",
    //   render: (_, row) => (
    //     <NegativeValue
    //       value={Number(row.mrrdc_itqty || 0) * Number(row.mrrdc_csrat || 0)}
    //     />
    //   ),
    // },
  ];

  const totalQty = listData.reduce(
    (acc, row) => acc + Number(row.mrrdc_itqty || 0),
    0,
  );
  const totalValue = listData.reduce(
    (acc, row) =>
      acc + Number(row.mrrdc_itqty || 0) * Number(row.mrrdc_csrat || 0),
    0,
  );
  return (
    <>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={15}
        sortable
        searchable
        striped
        hoverable
        exportable
        exportFilename="data-export.csv"
        //onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
      />
      Qty: {totalQty} || Value: {totalValue}
    </>
  );
};
export default PriceLedger;
