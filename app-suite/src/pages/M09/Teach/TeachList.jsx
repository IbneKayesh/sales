import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";

const TeachList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "teach_srial", header: "Serial", width: "110px" },
    { key: "teach_cname", header: "Student Name", width: "180px" },
    { key: "teach_ttype", header: "Subject", width: "150px" },
    { key: "teach_marks", header: "Marks", width: "90px" },
    {
      key: "teach_stats",
      header: "Status",
      width: "110px",
      body: (v) => (
        <Badge variant={v ? "success" : "secondary"}>
          {v ? <IconCheck size={12} /> : <IconClose size={12} />}
          {v ? "Passed" : "Not Passed"}
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
      exportFilename="teach-data.csv"
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No teaching materials found"
    />
  );
};

export default TeachList;
