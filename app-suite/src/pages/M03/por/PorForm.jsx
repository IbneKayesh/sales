import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { PageSection } from "@/components/PageCard";
import { IconPlus, IconClose, IconSave } from "@/icons";

const PorForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  cntct_Options,
  //modal
  onShowModal,
}) => {
  return (
    <div className="form-wrap">
      <PageSection title="General">
        <div className="grid">
          <div className="col-span-3">
            <Dropdown
              label="Department"
              options={dpart_Options}
              value={formData.pordm_dpart}
              onChange={(e) => onChange("pordm_dpart", e.target.value)}
              error={formErrors.pordm_dpart}
              required
              placeholder="Select..."
              disabled={readOnly || stopEdit}
              optionValue="id"
              optionLabel="dpart_cname"
            />
          </div>
          <div className="col-span-4">
            <Dropdown
              label="Supplier"
              options={cntct_Options}
              value={formData.pordm_cntct}
              onChange={(e) => onChange("pordm_cntct", e.target.value)}
              error={formErrors.pordm_cntct}
              required
              placeholder="Select..."
              disabled={readOnly || stopEdit}
              optionValue="id"
              optionLabel="cntct_cname"
              optionGrid="cntct_cname:Name,cntct_cntps:Person,cntct_cntno:Contact,cntct_ofadr:Address,cntct_dspct:Discount%,cntct_crlmt:Credit,party_crbal:Balance"
            />
          </div>
          <div className="col-span-2">
            <InputCalendar
              label="Date"
              value={formData.pordm_trdat}
              onChange={(e) => onChange("pordm_trdat", e.target.value)}
              placeholder="Select..."
              error={formErrors.pordm_trdat}
              required
              disabled={readOnly || true}
            />
          </div>
          <div className="col-span-3">
            <InputText
              label="Ref No"
              placeholder="Enter reference no"
              value={formData.pordm_refno}
              onChange={(e) => onChange("pordm_refno", e.target.value)}
              error={formErrors.pordm_refno}
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
              value={formData.pordm_vehid}
              onChange={(e) => onChange("pordm_vehid", e.target.value)}
              error={formErrors.pordm_vehid}
              disabled={readOnly}
            />
          </div>
          <div className="col-span-8">
            <InputText
              label="Notes"
              placeholder="Enter notes"
              value={formData.pordm_notes}
              onChange={(e) => onChange("pordm_notes", e.target.value)}
              error={formErrors.pordm_notes}
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      {formData?.id && (
        <AuditData
          actve={formData.pordm_actve}
          cname={formData.crusr_cname}
          cdate={formData.pordm_crdat}
          uname={formData.upusr_cname}
          udate={formData.pordm_updat}
          rvnmr={formData.pordm_rvnmr}
        />
      )}
      <div className="form-actions">
        {!readOnly && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowModal("PAYMENT")}
            >
              <IconPlus size={14} className="icon-left" />
              Add Payment
            </Button>
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
export default PorForm;
