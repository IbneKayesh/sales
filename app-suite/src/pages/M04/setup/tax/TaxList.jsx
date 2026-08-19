import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const TaxList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "txcod_ccode", header: "Code", width: "80px" },
    {
      key: "txcod_txtyp",
      header: "TAX Type",
      width: "80px",
      body: (_, row) => {
        return (
          <span className={`${!row.txcod_actve && "text-red-500"}`}>
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
        <ActionButton
          rowData={row}
          actve={row.txcod_actve}
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
      pageSize={15}
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
export default TaxList;
