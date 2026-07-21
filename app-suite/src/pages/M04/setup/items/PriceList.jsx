import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const PriceList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "items_iname", header: "Name", width: "200px" },
    { key: "price_cname", header: "Price", width: "200px" },
    { key: "price_lprat", header: "L.Purchase Rate", width: "80px" },
    { key: "price_dprat", header: "Distributor Rate", width: "80px" },
    { key: "price_tprat", header: "Trade Rate", width: "80px" },
    { key: "price_mrrat", header: "MRP", width: "80px" },
    { key: "price_dspct", header: "Discount %", width: "80px" },
    { key: "price_gdstk", header: "Good Stock", width: "80px" },
    { key: "price_bdstk", header: "Bad Stock", width: "80px" },
    { key: "price_mnqty", header: "Min Qty", width: "80px" },
    { key: "price_mxqty", header: "Max Qty", width: "80px" },
    { key: "price_pbqty", header: "Purchase Booked", width: "80px" },
    { key: "price_sbqty", header: "Sales Booked", width: "80px" },
    {
      key: "price_actve",
      header: "Status",
      width: "120px",
      render: (v) => {
        return (
          <Badge variant={v ? "success" : "danger"}>
            {v ? <IconCheck size={12} /> : <IconClose size={12} />}
            {v ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "150px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.price_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
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
      emptyMessage="No prices found"
    />
  );
};
export default PriceList;
