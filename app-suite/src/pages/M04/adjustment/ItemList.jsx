import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose } from "@/icons";

const ItemList = ({ cfColumns = [], readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "items_iname",
      header: "Item",
      width: "200px",
      body: (_, row) => {
        return <span>{row.items_iname}</span>;
      },
    },
    {
      key: "price_cname",
      header: "Name",
      width: "200px",
      body: (_, row) => {
        return <span>{row.price_cname}</span>;
      },
    },
    {
      key: "adjsc_itrat",
      header: "Rate * Qty",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            {Number(rowData.adjsc_itrat).toFixed(4)} x{" "}
            {Number(rowData.adjsc_itqty).toFixed(4)} {rowData.units_cname} ={" "}
            {Number(rowData.adjsc_itamt).toFixed(4)}
          </>
        );
      },
    },
    { key: "adjsc_notes", header: "Notes", width: "100px" },
    {
      key: "stock_ohqty",
      header: "Stock",
      width: "80px",
      body: (_, rowData) => {
        return <>{(Number(rowData.stock_ohqty) || 0).toFixed(4)}</>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        // <ActionButton
        //   rowData={row}
        //   actve={row.invcc_actve}
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
      <p>(Items → Stock)</p>
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
    </>
  );
};
export default ItemList;
