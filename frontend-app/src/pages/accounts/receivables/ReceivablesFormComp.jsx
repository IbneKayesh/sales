import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmtb_paybl from "@/models/accounts/tmtb_paybl.json";
import { InputNumber } from "primereact/inputnumber";
import { paymentModeOptions } from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";

const ReceivablesFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="rcvbl_pymod"
          className="block text-900 font-medium mb-2"
        >
          Mode
          <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="rcvbl_pymod"
          value={formData.rcvbl_pymod}
          options={paymentModeOptions}
          optionLabel="label"
          optionValue="value"
          onChange={(e) => onChange("rcvbl_pymod", e.value)}
          className={`w-full ${errors.rcvbl_pymod ? "p-invalid" : ""}`}
          placeholder={`Select Mode`}
          filter
          showClear
        />
        {errors.rcvbl_pymod && (
          <small className="mb-3 text-red-500">{errors.rcvbl_pymod}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="rcvbl_trdat"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_paybl.rcvbl_trdat.label} <span className="text-red-500">*</span>
        </label>
        <Calendar
          name="rcvbl_trdat"
          value={
            formData.rcvbl_trdat
              ? typeof formData.rcvbl_trdat === "string" &&
                !formData.rcvbl_trdat.includes("T")
                ? new Date(formData.rcvbl_trdat + "T00:00:00")
                : new Date(formData.rcvbl_trdat)
              : null
          }
          onChange={(e) => onChange("rcvbl_trdat", e.target.value)}
          className={`w-full ${errors.rcvbl_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmtb_paybl.rcvbl_trdat.label}`}
        />
        {errors.rcvbl_trdat && (
          <small className="mb-3 text-red-500">{errors.rcvbl_trdat}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="rcvbl_descr"
          className="block text-900 font-medium mb-2"
        >
          {tmtb_paybl.rcvbl_descr.label}
        </label>
        <InputText
          name="rcvbl_descr"
          value={formData.rcvbl_descr}
          onChange={(e) => onChange("rcvbl_descr", e.target.value)}
          className={`w-full ${errors.rcvbl_descr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_paybl.rcvbl_descr.label}`}
        />
        {errors.rcvbl_descr && (
          <small className="mb-3 text-red-500">{errors.rcvbl_descr}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="rcvbl_dbamt"
          className="block text-900 font-medium mb-2"
        >
          Amount <span className="text-red-500">*</span>
        </label>
        <InputNumber
          name="rcvbl_dbamt"
          value={formData.rcvbl_dbamt}
          onValueChange={(e) => onChange("rcvbl_dbamt", e.value)}
          className={`${errors.rcvbl_dbamt ? "p-invalid" : ""}`}
          style={{ width: "100%" }}
          inputStyle={{ width: "100%", textAlign: "right" }}
          variant="filled"
          mode="decimal"
          minFractionDigits={2}
          maxFractionDigits={2}
          locale="en"
        />
        {errors.rcvbl_dbamt && (
          <small className="mb-3 text-red-500">{errors.rcvbl_dbamt}</small>
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

export default ReceivablesFormComp;
