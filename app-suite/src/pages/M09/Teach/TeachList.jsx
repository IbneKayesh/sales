import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck } from "@/icons";
import InactiveText from "@/components/InactiveText";

const TeachList = ({ listData, onEdit, onDelete }) => {
  const dtColumns = [
    { key: "teach_srial", header: "Serial", width: "80px" },
    {
      key: "teach_cname",
      header: "Title",
      width: "220px",
      body: (_, row) => {
        return <InactiveText text={row.teach_cname} active={row.teach_actve} />;
      },
    },
    { key: "teach_descr", header: "Description", width: "320px" },
    { key: "teach_notes", header: "Notes", width: "80px" },
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
