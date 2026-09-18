import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import NegativeValue from "@/components/common/NegativeValue";
import { getRelativeDays } from "@/utils/datetime.js";

const OrderList = ({ cfColumns, listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "odrdm_trnno",
      header: "SO No",
      width: "100px",
      footer: () => <span className="font-semibold">Total</span>,
      body: (_, row) => {
        return (
          <span className={`${!row.odrdm_actve && "text-red-500"}`}>
            {row.odrdm_trnno}
          </span>
        );
      },
    },
    {
      key: "odrdm_trdat",
      header: "Date",
      width: "90px",
      body: (v) => getRelativeDays(v),
    },
    { key: "dpart_cname", header: "Department", width: "150px" },
    { key: "cntct_cname", header: "Customer", width: "180px", footer: "count" },
    { key: "odrdm_refno", header: "Ref No", width: "100px" },
    { key: "odrdm_notes", header: "Notes", width: "100px" },
    {
      key: "odrdm_tramt",
      header: "Amount",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.odrdm_tramt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.odrdm_tramt} />
        </>
      ),
    },
    {
      key: "odrdm_pyamt",
      header: "Payable",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.odrdm_pyamt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.odrdm_pyamt} />
        </>
      ),
    },
    {
      key: "odrdm_pdamt",
      header: "Payment",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.odrdm_pdamt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.odrdm_pdamt} />
        </>
      ),
    },
    {
      key: "odrdm_duamt",
      header: "Due",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.odrdm_duamt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.odrdm_duamt} />
        </>
      ),
    },
    {
      key: "odrdm_ispst",
      header: "Posted",
      width: "80px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.odrdm_actve}
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
      pageSize={25}
      sortable
      searchable
      striped
      hoverable
      exportable
      exportFilename="data-export.csv"
      columnSettingsKey="m02-sales-order-list"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      className="mt-2"
      cfColumns={cfColumns}
    />
  );
};
export default OrderList;
