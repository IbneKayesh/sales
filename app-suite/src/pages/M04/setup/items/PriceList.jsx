import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconChevronDown, IconPackage, IconActivity } from "@/icons";
import NegativeValue from "@/components/common/NegativeValue";

const PriceList = ({
  cfColumns = [],
  listData,
  onEdit,
  onDelete,
  onLedger,
  onItemPriceBundle,
}) => {
  const dtColumns = [
    {
      key: "price_cname",
      header: "Price",
      width: "200px",
      body: (_, row) => {
        return (
          <span className={`${!row.price_actve && "text-red-500"}`}>
            {row.price_cname}
          </span>
        );
      },
    },
    {
      key: "dpart_cname",
      header: "Department",
      width: "80px",
    },
    {
      key: "price_lprat",
      header: "L.Purchase Rate",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_lprat} />,
    },
    {
      key: "price_dprat",
      header: "Distributor Rate",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_dprat} />,
    },
    {
      key: "price_tprat",
      header: "Trade Rate",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_tprat} />,
    },
    {
      key: "price_mrrat",
      header: "MRP",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_mrrat} />,
    },
    {
      key: "price_dspct",
      header: "Discount %",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_dspct} />,
    },
    {
      key: "price_gdstk",
      header: "Good Stock",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_gdstk} />,
    },
    {
      key: "price_bdstk",
      header: "Bad Stock",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_bdstk} />,
    },
    {
      key: "price_mnqty",
      header: "Min Qty",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_mnqty} />,
    },
    {
      key: "price_mxqty",
      header: "Max Qty",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_mxqty} />,
    },
    {
      key: "price_pbqty",
      header: "Purchase Booked",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_pbqty} />,
    },
    {
      key: "price_sbqty",
      header: "Sales Booked",
      width: "80px",
      body: (_, row) => <NegativeValue value={row.price_sbqty} />,
    },
    {
      key: "price_smrgn",
      header: "LPR vs MRP",
      width: "80px",
      body: (_, row) => (
        <>
          <NegativeValue value={row.price_smrgn} /> %
        </>
      ),
    },
    // {
    //   key: "price_actve",
    //   header: "Status",
    //   width: "120px",
    //   body: (v) => {
    //     return (
    //       <Badge variant={v ? "success" : "danger"}>
    //         {v ? <IconCheck size={12} /> : <IconClose size={12} />}
    //         {v ? "Active" : "Inactive"}
    //       </Badge>
    //     );
    //   },
    // },
    {
      key: "actions",
      header: "Actions",
      width: "150px",
      sortable: false,
      body: (_, row) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLedger(row);
            }}
            title="Ledger"
          >
            <IconChevronDown size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onItemPriceBundle(row);
            }}
            title="Item Price Bundle"
          >
            <IconPackage size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.price_actve}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      ),
    },
  ];
  return (
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
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      cfColumns={cfColumns}
    />
  );
};
export default PriceList;
