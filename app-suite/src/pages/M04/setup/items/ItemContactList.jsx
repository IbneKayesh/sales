import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose, IconCheck } from "@/icons";

const ItemContactList = ({ readOnly, listData, onDelete }) => {
  const dtColumns = [
    {
      key: "cntct_cname",
      header: "Supplier Name",
      width: "200px",
      body: (_, row) => {
        return (
          <span className={`${!row.itmct_actve && "text-red-500"}`}>
            {row.cntct_cname}
          </span>
        );
      },
    },
    { key: "itmct_lprat", header: "LPR", width: "80px" },
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
          {row.itmct_actve ? (
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
export default ItemContactList;
