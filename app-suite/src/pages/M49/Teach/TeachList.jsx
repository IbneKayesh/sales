import TreeDataTable from "@/components/TreeDataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import InactiveText from "@/components/InactiveText";
import { IconPlus } from "@/icons";

const TeachList = ({ treeData, onEdit, onDelete, onAddChild }) => {
  const dtColumns = [
    { key: "teach_srial", header: "Serial", width: "70px" },
    {
      key: "teach_cname",
      header: "Title",
      width: "120px",
      render: (_, row) => {
        return <InactiveText text={row.teach_cname} active={row.teach_actve} />;
      },
    },
    {
      key: "teach_descr",
      header: "Description",
      width: "220px",
      render: (v) => (v && v.length > 50 ? `${v.slice(0, 50)}...` : v),
    },
    { key: "teach_notes", header: "Notes", width: "80px" },
    {
      key: "teach_reads",
      header: "Reads",
      width: "80px",
      render: (v) => `${v || 0}x`,
    },
    {
      key: "teach_marks",
      header: "Points",
      width: "80px",
      render: (v) => `${v || 0} pts`,
    },
    {
      key: "actions",
      header: "Actions",
      width: "150px",
      sortable: false,
      render: (_, row) => (
        <div className="d-inline-flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(row);
            }}
            title="Add Child Lesson"
          >
            <IconPlus size={14} className="text-success" />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.teach_actve}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <TreeDataTable
      columns={dtColumns}
      data={treeData}
      treeColumn={1}
      searchable
      expandable
      storageKey="M09-teach-expanded"
      exportable
      exportFilename="teaching-materials.csv"
      striped
      hoverable
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No teaching materials found. Click 'Add' to create your first kids lesson!"
    />
  );
};

export default TeachList;
