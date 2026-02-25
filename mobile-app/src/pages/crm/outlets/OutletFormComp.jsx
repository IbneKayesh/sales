import RequiredText from "@/components/RequiredText";
import { InputText } from "primereact/inputtext";

const OutletFormComp = ({ formData, errors, onChange, onBack, onSave }) => {
  return (
    <div className="lite-card">
      {/* ── Header ── */}
      <div className="header-row">
        <div className="header-row-actions">
          <button
            className="lite-button lite-button-secondary lite-button-sm"
            onClick={() => onBack()}
          >
            <span className="pi pi-arrow-left mr-1 text-xs" />
            Back
          </button>
          <button
            className="lite-button lite-button-primary lite-button-sm"
            onClick={(e) => onSave(e)}
          >
            <span className="pi pi-check mr-1 text-xs" />
            Save
          </button>
        </div>
        <div className="entity-meta-block">
          <span className="entity-meta-name">
            {formData?.cntct_cntnm || "New Outlet"}
          </span>
        </div>
      </div>

      <div className="lite-card-divider" />

      {/* ── Form Fields ── */}
      <div className="p-3">
        <div className="form-field-group">
          <label htmlFor="cntct_cntnm" className="form-field-label required">
            Outlet Name
          </label>
          <InputText
            id="cntct_cntnm"
            name="cntct_cntnm"
            value={formData?.cntct_cntnm ?? ""}
            onChange={(e) => onChange("cntct_cntnm", e.target.value)}
            className={`w-full ${errors?.cntct_cntnm ? "p-invalid" : ""}`}
            placeholder={"Enter outlet name"}
          />
          <RequiredText text={errors?.cntct_cntnm} />
        </div>
        <div className="form-field-group">
          <label htmlFor="cntct_cntps" className="form-field-label required">
            Contact Person
          </label>
          <InputText
            id="cntct_cntps"
            name="cntct_cntps"
            value={formData?.cntct_cntps ?? ""}
            onChange={(e) => onChange("cntct_cntps", e.target.value)}
            className={`w-full ${errors?.cntct_cntps ? "p-invalid" : ""}`}
            placeholder={"Enter contact person"}
          />
          <RequiredText text={errors?.cntct_cntps} />
        </div>
        <div className="form-field-group">
          <label htmlFor="cntct_cntno" className="form-field-label required">
            Contact Number
          </label>
          <InputText
            id="cntct_cntno"
            name="cntct_cntno"
            value={formData?.cntct_cntno ?? ""}
            onChange={(e) => onChange("cntct_cntno", e.target.value)}
            className={`w-full ${errors?.cntct_cntno ? "p-invalid" : ""}`}
            placeholder={"Enter contact number"}
          />
          <RequiredText text={errors?.cntct_cntno} />
        </div>
        <div className="form-field-group">
          <label htmlFor="cntct_ofadr" className="form-field-label required">
            Address
          </label>
          <InputText
            id="cntct_ofadr"
            name="cntct_ofadr"
            value={formData?.cntct_ofadr ?? ""}
            onChange={(e) => onChange("cntct_ofadr", e.target.value)}
            className={`w-full ${errors?.cntct_ofadr ? "p-invalid" : ""}`}
            placeholder={"Enter address"}
          />
          <RequiredText text={errors?.cntct_ofadr} />
        </div>
      </div>
    </div>
  );
};

export default OutletFormComp;
