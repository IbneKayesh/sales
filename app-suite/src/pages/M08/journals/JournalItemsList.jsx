import DataTable from "@/components/DataTable";
import ActionButton from "@/components/ActionButton";
import Button from "@/components/Button";
import InputNumber from "@/components/InputNumber";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import Modal, { ModalHeader, ModalTitle, ModalBody } from "@/components/Modal";
import { IconPlus } from "@/icons";
import { sorce_Options } from "@/utils/vtable.js";

const JournalItemsList = ({
  readOnly,
  listData,
  formData,
  formErrors,
  onChange,
  onAddToList,
  onEdit,
  onDelete,
  chtac_Options,
  party_Options,
  showModal,
  onShowModal,
  onHideModal,
}) => {
  const totalDr = listData.reduce(
    (sum, item) => sum + (Number(item.jrnlc_drval) || 0),
    0,
  );
  const totalCr = listData.reduce(
    (sum, item) => sum + (Number(item.jrnlc_crval) || 0),
    0,
  );

  const dtColumns = [
    {
      key: "chtac_cname",
      header: "Account",
      width: "200px",
    },
    { key: "party_cname", header: "Party", width: "150px" },
    {
      key: "jrnlc_drval",
      header: "Debit",
      width: "100px",
      render: (v) => v?.toLocaleString?.() || "0",
    },
    {
      key: "jrnlc_crval",
      header: "Credit",
      width: "100px",
      render: (v) => v?.toLocaleString?.() || "0",
    },
    { key: "jrnlc_descr", header: "Description", width: "200px" },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.jrnlc_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      visible: !readOnly,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mt-4 mb-2">
        <h4 className="font-semibold text-gray-700">
          Journal Lines
          <span className="ml-4 text-sm font-normal text-gray-500">
            Dr: {totalDr.toLocaleString()} | Cr: {totalCr.toLocaleString()}
            {Math.abs(totalDr - totalCr) > 0.001 && (
              <span className="ml-2 text-red-500 font-medium">
                (Difference: {(totalDr - totalCr).toLocaleString()})
              </span>
            )}
          </span>
        </h4>
        {!readOnly && (
          <Button size="sm" variant="outline" onClick={onShowModal}>
            <IconPlus size={14} className="icon-left" />
            Add Line
          </Button>
        )}
      </div>
      <DataTable
        columns={dtColumns}
        data={listData}
        pageSize={10}
        sortable
        searchable={false}
        striped
        hoverable
        exportable={false}
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No journal lines added yet"
        className="mt-2"
      />

      <Modal open={showModal} onClose={onHideModal} size="lg">
        <ModalHeader>
          <ModalTitle
            title="Journal Line"
            subtitle="Debit / Credit Entry"
            onClose={onHideModal}
          />
        </ModalHeader>
        <ModalBody>
          <div className="form-wrap">
            <div className="grid">
              <div className="col-span-6">
                <Dropdown
                  label="Account"
                  options={chtac_Options}
                  value={formData.jrnlc_chtac}
                  onChange={(e) => onChange("jrnlc_chtac", e.target.value)}
                  error={formErrors.jrnlc_chtac}
                  required
                  placeholder="Select..."
                  optionValue="id"
                  optionLabel="chtac_cname"
                />
              </div>
              <div className="col-span-6">
                <Dropdown
                  label="Party"
                  options={party_Options}
                  value={formData.jrnlc_party}
                  onChange={(e) => onChange("jrnlc_party", e.target.value)}
                  error={formErrors.jrnlc_party}
                  placeholder="Select..."
                  optionValue="id"
                  optionLabel="party_cname"
                />
              </div>
              <div className="col-span-4">
                <InputNumber
                  label="Debit Amount"
                  placeholder="Enter debit"
                  value={formData.jrnlc_drval}
                  onChange={(e) => onChange("jrnlc_drval", e.target.value)}
                  error={formErrors.jrnlc_drval}
                  step="0.01"
                  min={0}
                />
              </div>
              <div className="col-span-4">
                <InputNumber
                  label="Credit Amount"
                  placeholder="Enter credit"
                  value={formData.jrnlc_crval}
                  onChange={(e) => onChange("jrnlc_crval", e.target.value)}
                  error={formErrors.jrnlc_crval}
                  step="0.01"
                  min={0}
                />
              </div>
              <div className="col-span-4">
                <Dropdown
                  label="Source"
                  options={sorce_Options}
                  value={formData.jrnlc_sorce}
                  onChange={(e) => onChange("jrnlc_sorce", e.target.value)}
                  error={formErrors.jrnlc_sorce}
                  placeholder="Select..."
                />
              </div>
              <div className="col-span-12">
                <InputText
                  label="Description"
                  placeholder="Enter description"
                  value={formData.jrnlc_descr}
                  onChange={(e) => onChange("jrnlc_descr", e.target.value)}
                  error={formErrors.jrnlc_descr}
                />
              </div>
            </div>
            <div className="form-actions">
              <Button variant="info" onClick={onAddToList}>
                <IconPlus size={16} className="icon-left" />
                Add Line
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default JournalItemsList;
