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
  const handleToggle = (key) => {
    const next = cfColumns.map((col) =>
      col.id === key ? { ...col, value: !col.tabcl_visbu } : col,
    );
   console.log(next)
    onChange?.(next);
  };

  // True when the current selection matches the default visibility
  const isDefault = true;
  // cfColumns.length === defaultCfColumns.length &&
  // cfColumns.every(
  //   (col, i) =>
  //     col.key === defaultCfColumns[i]?.key &&
  //     col.value === defaultCfColumns[i]?.value,
  // );

  const handleReset = () => {
    onChange?.(defaultCfColumns.map((col) => ({ ...col })));
    onClose?.();
  };

  const canReset = true; //defaultCfColumns.length > 0;

  const visibleCount = cfColumns.filter((col) => col.value).length;

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
              checked={col.tabcl_visbu !== false}
              onChange={() => handleToggle(col.id)}
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
