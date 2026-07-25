import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import { getRelativeDays } from "@/utils/datetime.js";

const JournalList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "jrnlm_trnno", header: "Trn No", width: "100px" },
    {
      key: "jrnlm_trdat",
      header: "Date",
      width: "100px",
      render: (v) => getRelativeDays(v),
    },
    { key: "jrnlm_narrt", header: "Narration", width: "250px" },
    { key: "jrnlm_trtyp", header: "Type", width: "120px" },
    {
      key: "jrnlm_drval",
      header: "Debit",
      width: "100px",
      render: (v) => v?.toLocaleString?.() || v,
    },
    {
      key: "jrnlm_crval",
      header: "Credit",
      width: "100px",
      render: (v) => v?.toLocaleString?.() || v,
    },
    {
      key: "jrnlm_stats",
      header: "Status",
      width: "100px",
      render: (v) => {
        const isDraft = v === "Draft";
        return (
          <Badge variant={isDraft ? "warning" : "success"}>
            {isDraft ? <IconClose size={12} /> : <IconCheck size={12} />}
            {v}
          </Badge>
        );
      },
    },
    {
      key: "jrnlm_actve",
      header: "Active",
      width: "80px",
      render: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.jrnlm_actve}
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
      exportFilename="journal-export.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No journal entries found"
      className="mt-2"
    />
  );
};
export default JournalList;
