import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import { IconClose, IconCheck, IconDollar } from "@/icons";
import NegativeValue from "@/components/common/NegativeValue";

const ItemsList = ({ listData, onEdit, onDelete, onPrice }) => {
  const dtColumns = [
    { key: "items_icode", header: "Code", width: "120px" },
    {
      key: "items_iname",
      header: "Item Name",
      width: "200px",
      render: (_, row) => {
        return (
          <span className={`${!row.items_actve && "text-red-500"}`}>
            {row.items_iname}, {row.items_szqty} {row.sunit_cname}
            {row.price_count > 0 && " "}
            {row.price_count > 0 && (
              <Chip
                variant={row.price_count > 0 ? "primary" : "secondary"}
                size="sm"
                style={{ marginLeft: "5px", fontWeight: 600 }}
              >
                {row.price_count} Price
              </Chip>
            )}
          </span>
        );
      },
    },
    { key: "items_brcod", header: "Barcode", width: "140px" },
    {
      key: "runit_cname",
      header: "Unit",
      width: "200px",
      render: (_, row) => {
        return (
          <span>
            {row.items_pkqty} x {row.runit_cname} = 1 {row.punit_cname}
          </span>
        );
      },
    },
    {
      key: "sgrup_cname",
      header: "Group",
      width: "80px",
      render: (_, row) => {
        return (
          <span>
            {row.sgrup_cname}, {row.items_itype}
          </span>
        );
      },
    },
    { key: "scatg_cname", header: "Category", width: "80px" },
    { key: "brand_cname", header: "Brand", width: "120px" },
    {
      key: "price_gdstk",
      header: "Stock",
      width: "80px",
      render: (_, row) => {
        const lineStock = row.price_gdstk || 0 + row.price_bdstk || 0;
        return (
          <span className={`${lineStock > 0 && "text-green-500"}`}>
            {Number(row.price_gdstk).toFixed(2)} +{" "}
            {Number(row.price_bdstk).toFixed(2)} ={" "}
            <NegativeValue value={Number(lineStock).toFixed(2)} />
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "150px",
      sortable: false,
      render: (_, row) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPrice(row);
            }}
            title="Prices"
          >
            <IconDollar size={14} />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.items_actve}
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
      pageSize={30}
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
export default ItemsList;
