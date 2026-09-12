import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const ExamList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "exams_srial", header: "Serial", width: "110px" },
    { key: "exams_teach", header: "Teaching", width: "150px" },
    { key: "exams_cname", header: "Question Name", width: "180px" },
    { key: "exams_marks", header: "Marks", width: "90px" },
    {
      key: "exams_answr",
      header: "Answer",
      width: "200px",
      body: (_, row) => (
        <span className="text-truncate">{row.exams_answr}</span>
      ),
    },
    {
      key: "exams_stats",
      header: "Result",
      width: "110px",
      body: (v) => (
        <Badge variant={v ? "success" : "danger"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Pass" : "Fail"}
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
      exportFilename="exam-data.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No exam questions found"
    />
  );
};

export default ExamList;
