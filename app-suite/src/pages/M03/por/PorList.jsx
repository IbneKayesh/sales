import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import NegativeValue from "@/components/common/NegativeValue";
import { getRelativeDays } from "@/utils/datetime.js";

const PorList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "pordm_trnno",
      header: "PO No",
      width: "100px",
      footer: () => <span className="font-semibold">Total</span>,
      body: (_, row) => {
        return (
          <span className={`${!row.pordm_actve && "text-red-500"}`}>
            {row.pordm_trnno}
          </span>
        );
      },
    },
    {
      key: "pordm_trdat",
      header: "Date",
      width: "90px",
      body: (v) => getRelativeDays(v),
    },
    { key: "dpart_cname", header: "Department", width: "150px" },
    { key: "cntct_cname", header: "Supplier", width: "180px", footer: "count" },
    { key: "pordm_refno", header: "Ref No", width: "100px" },
    {
      key: "pordm_tramt",
      header: "Amount",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.pordm_tramt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.pordm_tramt} />
        </>
      ),
    },
    {
      key: "pordm_pyamt",
      header: "Payable",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.pordm_pyamt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.pordm_pyamt} />
        </>
      ),
    },
    {
      key: "pordm_pdamt",
      header: "Advance",
      width: "80px",
      footer: (_, row) => {
        return row.reduce((sum, row) => sum + Number(row.pordm_pdamt ?? 0), 0);
      },
      body: (_, row) => (
        <>
          <NegativeValue value={row.pordm_pdamt} />
        </>
      ),
    },
    {
      key: "pordm_ispst",
      header: "Posted",
      width: "80px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "pordm_ispnd",
      header: "MRR Pending",
      width: "80px",
      body: (v) => (
        <Badge variant={v ? "warning" : "success"} size="sm">
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
          actve={row.pordm_actve}
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
      columnSettingsKey="m03-por-list"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      className="mt-2"
    />
  );
};
export default PorList;
