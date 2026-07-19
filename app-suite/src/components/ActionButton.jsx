import { IconEdit, IconClose, IconCheck } from "@/icons";
import Button from "@/components/Button";

const ActionButton = ({ rowData, actve, onEdit, onDelete }) => {
  return (
    <div className="d-inline-flex gap-1">
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
          <IconClose size={14} />
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
          <IconCheck size={14} />
        </Button>
      )}
    </div>
  );
};
export default ActionButton;
