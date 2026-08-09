import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import Modal, {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/Modal";
import { IconRefresh } from "@/icons";

const TableColumns = ({ open, onClose, cfColumns = [], onChange }) => {
  // User-defined visibility (falls back to default when not overridden)
  const isVisible = (col) => col.tabcl_visbu !== false;
  const isDefaultVisible = (col) => col.tabcl_visbl !== false;

  const handleToggle = (col) => {
    onChange?.(col.id, !isVisible(col));
  };

  // Restore every column to its default visibility (tabcl_visbl)
  const handleReset = () => {
    cfColumns.forEach((col) => {
      if (isVisible(col) !== isDefaultVisible(col)) {
        onChange?.(col.id, isDefaultVisible(col));
      }
    });
    onClose?.();
  };

  // True when every column still matches its default visibility
  const isDefault = cfColumns.every(
    (col) => isVisible(col) === isDefaultVisible(col),
  );

  const canReset = cfColumns.length > 0;

  const visibleCount = cfColumns.filter(isVisible).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      className="table-columns-modal"
    >
      <ModalHeader>
        <ModalTitle
          title="Column Settings"
          subtitle={`${visibleCount} of ${cfColumns.length} columns visible${isDefault ? "" : " · Modified"}`}
          onClose={onClose}
        />
      </ModalHeader>
      <ModalBody>
        <div className="table-columns__list">
          {cfColumns.map((col) => (
            <Checkbox
              key={col.id}
              label={col.tabcl_title}
              checked={isVisible(col)}
              onChange={() => handleToggle(col)}
            />
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="table-columns__footer">
          <Button
            variant="ghost"
            size="sm"
            disabled={!canReset || isDefault}
            icon={<IconRefresh size={14} />}
            onClick={handleReset}
            title="Restore default column visibility"
          >
            Reset to default
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
export default TableColumns;
