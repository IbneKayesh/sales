import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { PageSection } from "@/components/PageCard";
import { IconPlus, IconClose, IconSave } from "@/icons";
import InputLabel from "@/components/InputLabel";

const OrderForm = ({
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
  emply_Options,
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
              value={formData.odrdm_dpart}
              onChange={(e) => onChange("odrdm_dpart", e.target.value)}
              error={formErrors.odrdm_dpart}
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
              value={formData.odrdm_cntct}
              onChange={(e) => onChange("odrdm_cntct", e.target.value)}
              error={formErrors.odrdm_cntct}
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
              value={formData.odrdm_trdat}
              onChange={(e) => onChange("odrdm_trdat", e.target.value)}
              placeholder="Select..."
              error={formErrors.odrdm_trdat}
              required
              disabled={readOnly || true}
            />
          </div>
          <div className="col-span-3">
            <InputText
              label="Ref No"
              placeholder="Enter reference no"
              value={formData.odrdm_refno}
              onChange={(e) => onChange("odrdm_refno", e.target.value)}
              error={formErrors.odrdm_refno}
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      <PageSection title="Delivery and Remarks">
        <div className="grid">
          <div className="col-span-3">
            <InputLabel label="Trip" value={formData.tripm_trnno} />
          </div>
          <div className="col-span-3">
            <Dropdown
              label="Posted By"
              options={emply_Options}
              value={formData.odrdm_pstby}
              onChange={(e) => onChange("odrdm_pstby", e.target.value)}
              error={formErrors.odrdm_pstby}
              placeholder="Select..."
              disabled={readOnly || stopEdit}
              optionValue="id"
              optionLabel="party_cname"
              optionGrid="party_cname:Name,chtac_chtno:COA,party_crbal:Balance"
            />
          </div>
          <div className="col-span-6">
            <InputText
              label="Notes"
              placeholder="Enter notes"
              value={formData.odrdm_notes}
              onChange={(e) => onChange("odrdm_notes", e.target.value)}
              error={formErrors.odrdm_notes}
              disabled={readOnly}
            />
          </div>
        </div>
      </PageSection>
      {formData?.id && (
        <AuditData
          actve={formData.odrdm_actve}
          cname={formData.crusr_cname}
          cdate={formData.odrdm_crdat}
          uname={formData.upusr_cname}
          udate={formData.odrdm_updat}
          rvnmr={formData.odrdm_rvnmr}
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
export default OrderForm;
