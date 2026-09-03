import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import NegativeValue from "@/components/common/NegativeValue";
import { getRelativeDays } from "@/utils/datetime.js";

const AdjustmentList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    {
      key: "adjsm_trnno",
      header: "Transaction",
      width: "100px",
      body: (_, row) => {
        return (
          <span className={`${!row.adjsm_actve && "text-red-500"}`}>
            {row.adjsm_trnno}
          </span>
        );
      },
    },
    {
      key: "adjsm_trdat",
      header: "Date",
      width: "90px",
      body: (v) => getRelativeDays(v),
    },
    { key: "dpart_cname", header: "Department", width: "150px" },
    { key: "adjsm_refno", header: "Ref No", width: "100px" },
    { key: "adjsm_notes", header: "Notes", width: "100px" },
    { key: "adjsm_tramt", header: "Amount", width: "100px" },
    {
      key: "adjsm_ispst",
      header: "Posted",
      width: "80px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "adjsm_isapp",
      header: "Approved",
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
          actve={row.adjsm_actve}
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
      columnSettingsKey="m04-adjustment-list"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
      className="mt-2"
    />
  );
};
export default AdjustmentList;
