import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import NegativeValue from "@/components/common/NegativeValue";
import { getRelativeDays } from "@/utils/datetime.js";

const TransferList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "trndm_trnno",
      header: "MRR No",
      width: "100px",
      footer: () => <span className="font-semibold">Total</span>,
      body: (_, row) => {
        return (
          <span className={`${!row.trndm_actve && "text-red-500"}`}>
            {row.trndm_trnno}
          </span>
        );
      },
    },
    {
      key: "trndm_trdat",
      header: "Date",
      width: "90px",
      body: (v) => getRelativeDays(v),
    },
    { key: "dpart_cname", header: "Department", width: "150px" },
    { key: "cntct_cname", header: "Supplier", width: "180px", footer: "count" },
    { key: "trndm_refno", header: "Ref No", width: "100px" },
    {
      key: "trndm_tramt",
      header: "Amount",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.trndm_tramt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.trndm_tramt} />
        </>
      ),
    },
    {
      key: "trndm_ispst",
      header: "Posted",
      width: "80px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "trndm_isrcv",
      header: "Received",
      width: "80px",
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.trndm_actve}
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
      columnSettingsKey="m03-mrr-list"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      className="mt-2"
    />
  );
};
export default TransferList;
