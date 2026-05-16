import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const HeaderComp = ({ formData, errors, onChange, migrn_cntct_Options}) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Contact</label>
        <Dropdown
          name="migrn_cntct"
          value={formData.migrn_cntct}
          onChange={(e) => onChange("migrn_cntct", e.value)}
          options={migrn_cntct_Options}
          optionLabel="cntct_cntnm"
          optionValue="id"
          className={`w-full ${errors.migrn_cntct ? "p-invalid" : ""}`}
          placeholder="Select contact"
          filter
          showClear
          disabled={formData.id}
        />
        <RequiredText text={errors.migrn_cntct} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Trn No</label>
        <InputText
          name="migrn_trnno"
          value={formData.migrn_trnno}
          onChange={(e) => onChange("migrn_trnno", e.target.value)}
          className={`w-full ${errors.migrn_trnno ? "p-invalid" : ""}`}
          placeholder="Trn No [Auto]"
          disabled
        />
        <RequiredText text={errors.migrn_trnno} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Date</label>
        <Calendar
          name="migrn_trdat"
          value={formData.migrn_trdat ? new Date(formData.migrn_trdat) : null}
          onChange={(e) =>
            onChange(
              "migrn_trdat",
              e.value ? e.value.toLocaleString().split("T")[0] : "",
            )
          }
          className={`w-full ${errors.migrn_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select trn date`}
          disabled={formData.id}
          variant={formData.id ? "filled" : ""}
        />
        <RequiredText text={errors.migrn_trdat} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Ref No</label>
        <InputText
          name="migrn_refno"
          value={formData.migrn_refno}
          onChange={(e) => onChange("migrn_refno", e.target.value)}
          className={`w-full ${errors.migrn_refno ? "p-invalid" : ""}`}
          placeholder="Enter ref no"
        />
        <RequiredText text={errors.migrn_refno} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2">Notes</label>
        <InputText
          name="migrn_notes"
          value={formData.migrn_notes}
          onChange={(e) => onChange("migrn_notes", e.target.value)}
          className={`w-full ${errors.migrn_notes ? "p-invalid" : ""}`}
          placeholder="Enter notes"
        />
        <RequiredText text={errors.migrn_notes} />
      </div>
    </div>
  );
};
export default HeaderComp;
