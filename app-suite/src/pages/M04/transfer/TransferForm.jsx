import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { PageSection } from "@/components/PageCard";
import { IconPlus, IconClose, IconSave } from "@/icons";

const inout_Options = [
  { label: "Transfer IO", value: "Transfer IO" },
  { label: "Transfer Out", value: "Transfer Out" },
  { label: "Transfer In", value: "Transfer In" },
];

const TransferForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  //modal
  onShowModal,
}) => {
  return (
    <div className="form-wrap">
      <PageSection title="General">
        <div className="grid">
          <div className="col-span-2">
            <Dropdown
              label="Type"
              options={inout_Options}
              value={formData.trndm_ttype}
              onChange={(e) => onChange("trndm_ttype", e.target.value)}
              error={formErrors.trndm_ttype}
              required
              placeholder="Select..."
              disabled={readOnly || stopEdit}
            />
          </div>
          <div className="col-span-3">
            <Dropdown
              label="From W/H"
              options={dpart_Options}
              value={formData.trndm_dpart}
              onChange={(e) => onChange("trndm_dpart", e.target.value)}
              error={formErrors.trndm_dpart}
              required
              placeholder="Select..."
              disabled={readOnly || stopEdit}
              optionValue="id"
              optionLabel="dpart_cname"
            />
          </div>
          <div className="col-span-3">
            <Dropdown
              label="To W/H"
              options={dpart_Options}
              value={formData.trndm_dparz}
              onChange={(e) => onChange("trndm_dparz", e.target.value)}
              error={formErrors.trndm_dparz}
              required
              placeholder="Select..."
              disabled={readOnly || stopEdit}
              optionValue="id"
              optionLabel="dpart_cname"
            />
          </div>
          <div className="col-span-2">
            <InputCalendar
              label="Date"
              value={formData.trndm_trdat}
              onChange={(e) => onChange("trndm_trdat", e.target.value)}
              placeholder="Select..."
              error={formErrors.trndm_trdat}
              required
              disabled={readOnly || true}
            />
          </div>
          <div className="col-span-2">
            <InputText
              label="Ref No"
              placeholder="Enter reference no"
              value={formData.trndm_refno}
              onChange={(e) => onChange("trndm_refno", e.target.value)}
              error={formErrors.trndm_refno}
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      <PageSection title="Delivery and Remarks">
        <div className="grid">
          <div className="col-span-4">
            <InputText
              label="Vehicle"
              placeholder="Enter vehicle"
              value={formData.trndm_vehid}
              onChange={(e) => onChange("trndm_vehid", e.target.value)}
              error={formErrors.trndm_vehid}
              disabled={readOnly}
            />
          </div>
          <div className="col-span-8">
            <InputText
              label="Notes"
              placeholder="Enter notes"
              value={formData.trndm_notes}
              onChange={(e) => onChange("trndm_notes", e.target.value)}
              error={formErrors.trndm_notes}
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      {formData?.id && (
        <AuditData
          actve={formData.trndm_actve}
          cname={formData.crusr_cname}
          cdate={formData.trndm_crdat}
          uname={formData.upusr_cname}
          udate={formData.trndm_updat}
          rvnmr={formData.trndm_rvnmr}
        />
      )}
      <div className="form-actions">
        {!readOnly && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowModal("COSTING")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Costing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowModal("ITEM")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Item
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy || readOnly}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default TransferForm;
