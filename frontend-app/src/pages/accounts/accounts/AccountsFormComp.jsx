import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmtb_acnts from "@/models/accounts/tmtb_acnts.json";

const AccountsFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-4">
        <label
          htmlFor="bacts_bankn"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_acnts.bacts_bankn.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bacts_bankn"
          value={formData.bacts_bankn}
          onChange={(e) => onChange("bacts_bankn", e.target.value)}
          className={`w-full ${errors.bacts_bankn ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_acnts.bacts_bankn.label}`}
        />
        {errors.bacts_bankn && (
          <small className="mb-3 text-red-500">{errors.bacts_bankn}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="bacts_brnch"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_acnts.bacts_brnch.label}
        </label>
        <InputText
          name="bacts_brnch"
          value={formData.bacts_brnch}
          onChange={(e) => onChange("bacts_brnch", e.target.value)}
          className={`w-full ${errors.bacts_brnch ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_acnts.bacts_brnch.label}`}
        />
        {errors.bacts_brnch && (
          <small className="mb-3 text-red-500">{errors.bacts_brnch}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bacts_routn"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_acnts.bacts_routn.label}
        </label>
        <InputText
          name="bacts_routn"
          value={formData.bacts_routn}
          onChange={(e) => onChange("bacts_routn", e.target.value)}
          className={`w-full ${errors.bacts_routn ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_acnts.bacts_routn.label}`}
        />
        {errors.bacts_routn && (
          <small className="mb-3 text-red-500">{errors.bacts_routn}</small>
        )}
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="bacts_acnam"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_acnts.bacts_acnam.label}
        </label>
        <InputText
          name="bacts_acnam"
          value={formData.bacts_acnam}
          onChange={(e) => onChange("bacts_acnam", e.target.value)}
          className={`w-full ${errors.bacts_acnam ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_acnts.bacts_acnam.label}`}
        />
        {errors.bacts_acnam && (
          <small className="mb-3 text-red-500">{errors.bacts_acnam}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="bacts_acnum"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_acnts.bacts_acnum.label}
        </label>
        <InputText
          name="bacts_acnum"
          value={formData.bacts_acnum}
          onChange={(e) => onChange("bacts_acnum", e.target.value)}
          className={`w-full ${errors.bacts_acnum ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_acnts.bacts_acnum.label}`}
        />
        {errors.bacts_acnum && (
          <small className="mb-3 text-red-500">{errors.bacts_acnum}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="bacts_notes"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_acnts.bacts_notes.label}
        </label>
        <InputText
          name="bacts_notes"
          value={formData.bacts_notes}
          onChange={(e) => onChange("bacts_notes", e.target.value)}
          className={`w-full ${errors.bacts_notes ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_acnts.bacts_notes.label}`}
        />
        {errors.bacts_notes && (
          <small className="mb-3 text-red-500">{errors.bacts_notes}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="bacts_opdat"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_acnts.bacts_opdat.label}
        </label>
        <Calendar
          name="bacts_opdat"
          value={
            formData.bacts_opdat
              ? typeof formData.bacts_opdat === "string" &&
                !formData.bacts_opdat.includes("T")
                ? new Date(formData.bacts_opdat + "T00:00:00")
                : new Date(formData.bacts_opdat)
              : null
          }
          onChange={(e) => onChange("bacts_opdat", e.target.value)}
          className={`w-full ${errors.bacts_opdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmtb_acnts.bacts_opdat.label}`}
        />
        {errors.bacts_opdat && (
          <small className="mb-3 text-red-500">{errors.bacts_opdat}</small>
        )}
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.id ? "Update" : "Save"}
            icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountsFormComp;
