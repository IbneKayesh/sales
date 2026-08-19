import DataTable from "@/components/DataTable";
import Button from "@/components/Button";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const ItemTaxList = ({ readOnly, listData, onDelete }) => {
  const dtColumns = [
    { key: "itmtx_ccode", header: "Code", width: "80px" },
    {
      key: "txcod_txtyp",
      header: "TAX Type",
      width: "80px",
      body: (_, row) => {
        return (
          <span className={`${!row.itmtx_actve && "text-red-500"}`}>
            {row.txcod_txtyp}
          </span>
        );
      },
    },
    { key: "txcod_txmod", header: "TAX Mode", width: "80px" },
    { key: "txcod_txrat", header: "TAX Rate (%)", width: "80px" },
    { key: "txcod_trcod", header: "Transaction", width: "80px" },
 {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row);
          }}
          title="Action"
        >
          {row.itmtx_actve ? (
            <IconClose size={14} className="text-red-500" />
          ) : (
            <IconCheck size={14} className="text-green-500" />
          )}
        </Button>
      ),
      visible: !readOnly,
    },
  ];
  return (
    <DataTable
      columns={dtColumns}
      data={listData}
      pageSize={15}
      sortable
      searchable={false}
      striped
      hoverable
      exportable={false}
      exportFilename="data-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      className="mt-2"
    />
  );
};
export default ItemTaxList;
