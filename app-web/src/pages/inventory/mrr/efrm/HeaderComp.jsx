import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const HeaderComp = ({ formData, errors, onChange, mrrmt_cntct_Options}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Contact</label>
        <Dropdown
          name="mrrmt_cntct"
          value={formData.mrrmt_cntct}
          onChange={(e) => onChange("mrrmt_cntct", e.value)}
          options={mrrmt_cntct_Options}
          optionLabel="cntct_cntnm"
          optionValue="id"
          className={`w-full ${errors.mrrmt_cntct ? "p-invalid" : ""}`}
          placeholder="Select contact"
          filter
          showClear
          disabled={formData.id}
        />
        <RequiredText text={errors.mrrmt_cntct} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Trn No</label>
        <InputText
          name="mrrmt_trnno"
          value={formData.mrrmt_trnno}
          onChange={(e) => onChange("mrrmt_trnno", e.target.value)}
          className={`w-full ${errors.mrrmt_trnno ? "p-invalid" : ""}`}
          placeholder="Trn No [Auto]"
          disabled
        />
        <RequiredText text={errors.mrrmt_trnno} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Date</label>
        <Calendar
          name="mrrmt_trdat"
          value={formData.mrrmt_trdat ? new Date(formData.mrrmt_trdat) : null}
          onChange={(e) =>
            onChange(
              "mrrmt_trdat",
              e.value ? e.value.toLocaleString().split("T")[0] : "",
            )
          }
          className={`w-full ${errors.mrrmt_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select trn date`}
          disabled={formData.id}
          variant={formData.id ? "filled" : ""}
        />
        <RequiredText text={errors.mrrmt_trdat} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Ref No</label>
        <InputText
          name="mrrmt_refno"
          value={formData.mrrmt_refno}
          onChange={(e) => onChange("mrrmt_refno", e.target.value)}
          className={`w-full ${errors.mrrmt_refno ? "p-invalid" : ""}`}
          placeholder="Enter ref no"
        />
        <RequiredText text={errors.mrrmt_refno} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2">Notes</label>
        <InputText
          name="mrrmt_notes"
          value={formData.mrrmt_notes}
          onChange={(e) => onChange("mrrmt_notes", e.target.value)}
          className={`w-full ${errors.mrrmt_notes ? "p-invalid" : ""}`}
          placeholder="Enter notes"
        />
        <RequiredText text={errors.mrrmt_notes} />
      </div>
    </div>
  );
};
export default HeaderComp;
