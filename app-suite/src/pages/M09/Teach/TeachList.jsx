import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const TeachList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "teach_srial", header: "Serial", width: "90px" },
    {
      key: "teach_cname",
      header: "Lesson / Topic Title",
      width: "220px",
      body: (v, row) => (
        <div>
          <span style={{ fontWeight: 600 }}>{v}</span>
          {row.teach_descr && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted, #6b7280)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "240px",
              }}
            >
              {row.teach_descr}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "teach_ttype",
      header: "Subject",
      width: "140px",
      body: (v) => <span className="badge badge-subtle">{v || "General"}</span>,
    },
    {
      key: "teach_tagno",
      header: "Grade / Age",
      width: "140px",
      body: (v) => v || "-",
    },
    {
      key: "teach_reads",
      header: "Reads",
      width: "80px",
      body: (v) => `${v || 0}x`,
    },
    {
      key: "teach_marks",
      header: "Points",
      width: "80px",
      body: (v) => `${v || 0} pts`,
    },
    {
      key: "teach_stats",
      header: "Status",
      width: "110px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Ready" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "teach_actve",
      header: "Active",
      width: "110px",
      body: (v) => (
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
      body: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.teach_actve}
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
      exportFilename="teaching-materials.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No teaching materials found. Click 'Add' to create your first kids lesson!"
    />
  );
};

export default TeachList;
