import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const ExamList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "exams_srial", header: "Serial", width: "90px" },
    {
      key: "teach_cname_ref",
      header: "Lesson / Material",
      width: "200px",
      body: (v, row) => (
        <span style={{ fontWeight: 500 }}>
          {v ? (
            <>
              <span className="badge badge-subtle" style={{ marginRight: "6px" }}>
                {row.teach_ttype_ref || "General"}
              </span>
              {v}
            </>
          ) : (
            <span style={{ color: "var(--text-muted, #9ca3af)", fontStyle: "italic" }}>
              Not Assigned
            </span>
          )}
        </span>
      ),
    },
    {
      key: "exams_cname",
      header: "Question / Task",
      width: "240px",
      body: (v, row) => (
        <div>
          <span style={{ fontWeight: 600 }}>{v}</span>
          {row.exams_answr && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted, #6b7280)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "260px",
              }}
            >
              Ans: {row.exams_answr}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "exams_marks",
      header: "Marks",
      width: "80px",
      body: (v) => `${v || 0} pts`,
    },
    {
      key: "exams_stats",
      header: "Status",
      width: "120px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Evaluated" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "exams_actve",
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
          actve={row.exams_actve}
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
      exportFilename="weekly-exams.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No exam questions found. Click 'Add' to create weekly quiz questions for your kids!"
    />
  );
};

export default ExamList;
