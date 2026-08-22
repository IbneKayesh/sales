import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { PageSection } from "@/components/PageCard";
import { IconPlus, IconClose, IconSave } from "@/icons";

const MrrForm = ({
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
              value={formData.mrrdm_dpart}
              onChange={(e) => onChange("mrrdm_dpart", e.target.value)}
              error={formErrors.mrrdm_dpart}
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
              value={formData.mrrdm_cntct}
              onChange={(e) => onChange("mrrdm_cntct", e.target.value)}
              error={formErrors.mrrdm_cntct}
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
              value={formData.mrrdm_trdat}
              onChange={(e) => onChange("mrrdm_trdat", e.target.value)}
              placeholder="Select..."
              error={formErrors.mrrdm_trdat}
              required
              disabled={readOnly || true}
            />
          </div>
          <div className="col-span-3">
            <InputText
              label="Ref No"
              placeholder="Enter reference no"
              value={formData.mrrdm_refno}
              onChange={(e) => onChange("mrrdm_refno", e.target.value)}
              error={formErrors.mrrdm_refno}
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
              value={formData.mrrdm_vehid}
              onChange={(e) => onChange("mrrdm_vehid", e.target.value)}
              error={formErrors.mrrdm_vehid}
              disabled={readOnly}
            />
          </div>{" "}
          <div className="col-span-8">
            <InputText
              label="Notes"
              placeholder="Enter notes"
              value={formData.mrrdm_notes}
              onChange={(e) => onChange("mrrdm_notes", e.target.value)}
              error={formErrors.mrrdm_notes}
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      {formData?.id && (
        <AuditData
          actve={formData.mrrdm_actve}
          cname={formData.crusr_cname}
          cdate={formData.mrrdm_crdat}
          uname={formData.upusr_cname}
          udate={formData.mrrdm_updat}
          rvnmr={formData.mrrdm_rvnmr}
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
export default MrrForm;
