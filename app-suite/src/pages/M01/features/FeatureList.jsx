import TreeDataTable from "@/components/TreeDataTable";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import { IconClose, IconCheck, IconPlus } from "@/icons";
import Button from "@/components/Button";

const FeatureList = ({ treeData, onEdit, onDelete, onAddChild }) => {
  const dtColumns = [
    {
      key: "fetur_cname",
      header: "Name",
      width: "80px",
      render: (_, row) => {
        return (
          <>
            {row.fetur_srial} ~ {row.fetur_cname}
            {row.fetur_stats && (
              <Badge variant="success" className="ms-2">
                Done
              </Badge>
            )}
          </>
        );
      },
    },
    { key: "fetur_descr", header: "Description", width: "80px" },
    { key: "fetur_notes", header: "Notes", width: "80px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
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
            title="Add Child"
          >
            <IconPlus size={14} className="text-success" />
          </Button>
          <ActionButton
            rowData={row}
            actve={row.fetur_actve}
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
      treeColumn={0}
      searchable
      expandable
      storageKey="M01-features-expanded"
      exportable
      exportFilename="data-export.csv"
      striped
      hoverable
      onRowClick={(row) => onEdit(row)}
      emptyMessage="No data found"
    />
  );
};
export default FeatureList;
