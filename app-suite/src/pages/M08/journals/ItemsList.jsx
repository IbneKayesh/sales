import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import { IconClose } from "@/icons";

const ItemsList = ({ readOnly, listData, onEdit, onDelete }) => {
  const totalDr = listData.reduce(
    (sum, item) => sum + (Number(item.jrnlc_drval) || 0),
    0,
  );
  const totalCr = listData.reduce(
    (sum, item) => sum + (Number(item.jrnlc_crval) || 0),
    0,
  );

  const dtColumns = [
    {
      key: "chtac_cname",
      header: "Account",
      width: "80px",
    },
    { key: "party_cname", header: "Party", width: "80px" },
    {
      key: "jrnlc_drval",
      header: "Debit",
      width: "80px",
      body: (v) => v?.toLocaleString?.() || "0",
      footer: (_) => totalDr?.toLocaleString?.() || "0",
    },
    {
      key: "jrnlc_crval",
      header: "Credit",
      width: "80px",
      body: (v) => v?.toLocaleString?.() || "0",
      footer: (_) => totalCr?.toLocaleString?.() || "0",
    },
    { key: "jrnlc_descr", header: "Description", width: "200px" },
    {
      key: "actions",
      header: "Actions",
      width: "50px",
      sortable: false,
      body: (_, row) => (
        // <ActionButton
        //   rowData={row}
        //   actve={row.jrnlc_actve}
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
      footer: (_) => {
        return <>{listData.length} Lines</>;
      },
      visible: !readOnly,
    },
  ];

  return (
    <div className="mt-2">
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={30}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        //onRowClick={(row) => onEdit(row)}
        emptyMessage="No journal lines added yet"
        className="mt-2"
      />
    </div>
  );
};
export default ItemsList;
