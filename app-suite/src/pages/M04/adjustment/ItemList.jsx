import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose } from "@/icons";
import ConvertUOM from "@/components/common/ConvertUOM";

const ItemList = ({ cfColumns = [], readOnly, listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "price_cname",
      header: "Name",
      width: "200px",
      body: (_, row) => {
        return (
          <span>
            {row.price_cname} - {row.items_szqty} {row.sunit_cname}
          </span>
        );
      },
    },
    {
      key: "items_iname",
      header: "Item",
      width: "80px",
      body: (_, row) => {
        return <span>{row.items_iname}</span>;
      },
      footer: (_, row) => {
        return listData.length + " lines";
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
            {Number(rowData.adjsc_itqty).toFixed(4)} {rowData.runit_cname} ={" "}
            {Number(rowData.adjsc_itamt).toFixed(4)}
          </>
        );
      },
      footer: (_, row) => {
        return (
          row.reduce((sum, row) => sum + Number(row.adjsc_itqty ?? 0), 0) +
          " = " +
          row.reduce((sum, row) => sum + Number(row.adjsc_itamt ?? 0), 0)
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
    },{
      key: "punit_cname",
      header: "Pack",
      width: "80px",
      body: (_, rowData) => {
        return (
          <>
            <ConvertUOM
              qty={rowData.adjsc_itqty}
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
            <ConvertUOM
              qty={rowData.adjsc_itqty}
              dfQty={rowData.items_szqty}
              runit={rowData.runit_cname}
              punit={rowData.sunit_cname}
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
