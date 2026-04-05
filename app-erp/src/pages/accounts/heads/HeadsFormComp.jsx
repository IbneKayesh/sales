import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmtb_trhed from "@/models/accounts/tmtb_trhed.json";
import {
  trhed_grpnmOptions,
  trhed_grtypOptions,
  contactTypeOptions,
} from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";
import { Checkbox } from "primereact/checkbox";

const HeadsFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-4">
        <label
          htmlFor="trhed_hednm"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_trhed.trhed_hednm.label}
        </label>
        <InputText
          name="trhed_hednm"
          value={formData.trhed_hednm}
          onChange={(e) => onChange("trhed_hednm", e.target.value)}
          className={`w-full ${errors.trhed_hednm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_trhed.trhed_hednm.label}`}
        />
        <RequiredText text={errors.trhed_hednm} />
      </div>
      <div className="col-12 md:col-8">
        <label htmlFor="trhed_descr" className="block font-bold mb-2">
          {tmtb_trhed.trhed_descr.label}
        </label>
        <InputText
          name="trhed_descr"
          value={formData.trhed_descr}
          onChange={(e) => onChange("trhed_descr", e.target.value)}
          className={`w-full ${errors.trhed_descr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_trhed.trhed_descr.label}`}
        />
        <RequiredText text={errors.trhed_descr} />
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="trhed_grpnm"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_trhed.trhed_grpnm.label}
        </label>
        <Dropdown
          name="trhed_grpnm"
          value={formData.trhed_grpnm}
          onChange={(e) => onChange("trhed_grpnm", e.value)}
          options={trhed_grpnmOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.trhed_grpnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_trhed.trhed_grpnm.label}`}
        />
        <RequiredText text={errors.trhed_grpnm} />
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="trhed_grtyp"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_trhed.trhed_grtyp.label}
        </label>
        <Dropdown
          name="trhed_grtyp"
          value={formData.trhed_grtyp}
          onChange={(e) => onChange("trhed_grtyp", e.value)}
          options={trhed_grtypOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.trhed_grtyp ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_trhed.trhed_grtyp.label}`}
        />
        <RequiredText text={errors.trhed_grtyp} />
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="trhed_cntyp"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_trhed.trhed_cntyp.label}
        </label>
        <Dropdown
          name="trhed_cntyp"
          value={formData.trhed_cntyp}
          onChange={(e) => onChange("trhed_cntyp", e.value)}
          options={contactTypeOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.trhed_cntyp ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_trhed.trhed_cntyp.label}`}
        />
        <RequiredText text={errors.trhed_cntyp} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="trhed_advic" className="block font-bold mb-2">
          {tmtb_trhed.trhed_advic.label}
        </label>
        <Checkbox
          id="trhed_advic"
          name="trhed_advic"
          checked={!!formData.trhed_advic}
          onChange={(e) => onChange("trhed_advic", e.checked ? 1 : 0)}
          className={errors.trhed_advic ? "p-invalid" : ""}
        />
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.id ? "Update" : "Save"}
            icon={"pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default HeadsFormComp;
