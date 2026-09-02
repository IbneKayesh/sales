import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { IconClose } from "@/icons";

const ItemList = ({ cfColumns = [], readOnly, listData, onEdit, onDelete }) => {
  const totalAmt = listData.reduce(
    (sum, item) => sum + (Number(item.bndlc_itamt) || 0),
    0,
  );

  const dtColumns = [
    {
      key: "price_cname",
      header: "Item",
      width: "200px",
    },
    {
      key: "bndlc_itrat",
      header: "Rate * Qty",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {Number(rowData.bndlc_itrat).toFixed(4)} x{" "}
            {Number(rowData.bndlc_itqty).toFixed(4)} {rowData.runit_cname} ={" "}
            {Number(rowData.bndlc_itamt).toFixed(4)}
          </>
        );
      },
      footer: (_) => totalAmt?.toLocaleString?.() || "0",
    },
    {
      key: "price_ccode",
      header: "Price Code",
      width: "80px",
    },
    {
      key: "items_icode",
      header: "Item Code",
      width: "80px",
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        // <ActionButton
        //   rowData={row}
        //   actve={row.bndlc_actve}
        //   onEdit={onEdit}
        //   onDelete={onDelete}
        // />
        <Button
          variant="ghost"
          size="sm"
          className="btn--icon-danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row);
          }}
          title="Remove Line"
        >
          <IconClose size={14} className="text-danger" />
        </Button>
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
      <Badge variant="danger" dot="true" className="mt-2">
        Current rate will not be applied; the actual rate will be used for
        transactions.
      </Badge>
      <Badge variant="danger" dot="true" className="mt-2">
        Items with 0 rate are treated as free.
      </Badge>
    </>
  );
};
export default ItemList;
