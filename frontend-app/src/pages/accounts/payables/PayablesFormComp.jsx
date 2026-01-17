import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmtb_rcvpy from "@/models/accounts/tmtb_rcvpy.json";
import { InputNumber } from "primereact/inputnumber";
import { paymentModeOptions } from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";

const PayablesFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="rcvpy_pymod"
          className="block text-900 font-medium mb-2"
        >
          Mode
          <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="rcvpy_pymod"
          value={formData.rcvpy_pymod}
          options={paymentModeOptions}
          optionLabel="label"
          optionValue="value"
          onChange={(e) => onChange("rcvpy_pymod", e.value)}
          className={`w-full ${errors.rcvpy_pymod ? "p-invalid" : ""}`}
          placeholder={`Select Mode`}
          filter
          showClear
        />
        {errors.rcvpy_pymod && (
          <small className="mb-3 text-red-500">{errors.rcvpy_pymod}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="rcvpy_notes"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_rcvpy.rcvpy_notes.label}
        </label>
        <InputText
          name="rcvpy_notes"
          value={formData.rcvpy_notes}
          onChange={(e) => onChange("rcvpy_notes", e.target.value)}
          className={`w-full ${errors.rcvpy_notes ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_rcvpy.rcvpy_notes.label}`}
        />
        {errors.rcvpy_notes && (
          <small className="mb-3 text-red-500">{errors.rcvpy_notes}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="rcvpy_trdat"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_rcvpy.rcvpy_trdat.label}
        </label>
        <Calendar
          name="rcvpy_trdat"
          value={
            formData.rcvpy_trdat
              ? typeof formData.rcvpy_trdat === "string" &&
                !formData.rcvpy_trdat.includes("T")
                ? new Date(formData.rcvpy_trdat + "T00:00:00")
                : new Date(formData.rcvpy_trdat)
              : null
          }
          onChange={(e) => onChange("rcvpy_trdat", e.target.value)}
          className={`w-full ${errors.rcvpy_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmtb_rcvpy.rcvpy_trdat.label}`}
        />
        {errors.rcvpy_trdat && (
          <small className="mb-3 text-red-500">{errors.rcvpy_trdat}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="rcvpy_pyamt"
          className="block text-900 font-medium mb-2"
        >
          Amount <span className="text-red-500">*</span>
        </label>
        <InputNumber
          name="rcvpy_pyamt"
          value={formData.rcvpy_pyamt}
          onValueChange={(e) => onChange("rcvpy_pyamt", e.value)}
          className={`${errors.rcvpy_pyamt ? "p-invalid" : ""}`}
          style={{ width: "100%" }}
          inputStyle={{ width: "100%", textAlign: "right" }}
          variant="filled"
          mode="decimal"
          minFractionDigits={2}
          maxFractionDigits={2}
          locale="en"
        />
        {errors.rcvpy_pyamt && (
          <small className="mb-3 text-red-500">{errors.rcvpy_pyamt}</small>
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

export default PayablesFormComp;
