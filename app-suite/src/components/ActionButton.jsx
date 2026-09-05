import { IconCopy, IconEdit, IconClose, IconCheck } from "@/icons";
import Button from "@/components/Button";

const ActionButton = ({ rowData, actve, onEdit, onCopy, onDelete }) => {
  return (
    <div className="d-inline-flex gap-1">
      {onCopy && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(rowData);
          }}
          title="Copy"
        >
          <IconCopy size={14} />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(rowData);
          }}
          title="Edit"
        >
          <IconEdit size={14} />
        </Button>
      )}
      {actve && (
        <Button
          variant="ghost"
          size="sm"
          className="btn--icon-danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(rowData);
          }}
          title="Inactive"
        >
          <IconClose size={14} className="text-danger" />
        </Button>
      )}
      {!actve && (
        <Button
          variant="ghost"
          size="sm"
          className="btn--icon-success"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(rowData);
          }}
          title="Active"
        >
          <IconCheck size={14} className="text-success" />
        </Button>
      )}
    </div>
  );
};
export default ActionButton;
