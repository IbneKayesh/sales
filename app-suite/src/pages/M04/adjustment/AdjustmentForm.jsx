import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { PageSection } from "@/components/PageCard";
import { IconPlus, IconClose, IconSave } from "@/icons";
import { adjsm_ttype_Options } from "@/utils/vtable";

const AdjustmentForm = ({
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
          <div className="col-span-4">
            <Dropdown
              label="Department"
              options={dpart_Options}
              value={formData.adjsm_dpart}
              onChange={(e) => onChange("adjsm_dpart", e.target.value)}
              error={formErrors.adjsm_dpart}
              required
              placeholder="Select..."
              disabled={readOnly || stopEdit}
              optionValue="id"
              optionLabel="dpart_cname"
            />
          </div>
          <div className="col-span-2">
            <Dropdown
              label="Type"
              options={adjsm_ttype_Options}
              value={formData.adjsm_ttype}
              onChange={(e) => onChange("adjsm_ttype", e.target.value)}
              error={formErrors.adjsm_ttype}
              required
              placeholder="Select..."
              disabled={readOnly || stopEdit}
              optionValue="value"
              optionLabel="label"
            />
          </div>
          <div className="col-span-2">
            <InputCalendar
              label="Date"
              value={formData.adjsm_trdat}
              onChange={(e) => onChange("adjsm_trdat", e.target.value)}
              placeholder="Select..."
              error={formErrors.adjsm_trdat}
              required
              disabled={readOnly || true}
            />
          </div>
          <div className="col-span-4">
            <InputText
              label="Ref No"
              placeholder="Enter reference no"
              value={formData.adjsm_refno}
              onChange={(e) => onChange("adjsm_refno", e.target.value)}
              error={formErrors.adjsm_refno}
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      <PageSection title="Remarks">
        <div className="grid">
          <div className="col-span-12">
            <InputText
              label="Notes"
              placeholder="Enter notes"
              value={formData.adjsm_notes}
              onChange={(e) => onChange("adjsm_notes", e.target.value)}
              error={formErrors.adjsm_notes}
              required
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      {formData?.id && (
        <AuditData
          actve={formData.adjsm_actve}
          cname={formData.crusr_cname}
          cdate={formData.adjsm_crdat}
          uname={formData.upusr_cname}
          udate={formData.adjsm_updat}
          rvnmr={formData.adjsm_rvnmr}
        />
      )}
      <div className="form-actions">
        {!readOnly && (
          <>
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
export default AdjustmentForm;
