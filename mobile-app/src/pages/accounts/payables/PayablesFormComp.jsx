import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmtb_paybl from "@/models/accounts/tmtb_paybl.json";
import { InputNumber } from "primereact/inputnumber";
import { paymentModeOptions } from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";

const PayablesFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="paybl_pymod"
          className="block font-bold mb-2 text-red-800"
        >
          Mode
        </label>
        <Dropdown
          name="paybl_pymod"
          value={formData.paybl_pymod}
          options={paymentModeOptions}
          optionLabel="label"
          optionValue="value"
          onChange={(e) => onChange("paybl_pymod", e.value)}
          className={`w-full ${errors.paybl_pymod ? "p-invalid" : ""}`}
          placeholder={`Select Mode`}
          filter
          showClear
        />
        <RequiredText text={errors.paybl_pymod} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="paybl_trdat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_paybl.paybl_trdat.label}
        </label>
        <Calendar
          name="paybl_trdat"
          value={
            formData.paybl_trdat
              ? typeof formData.paybl_trdat === "string" &&
                !formData.paybl_trdat.includes("T")
                ? new Date(formData.paybl_trdat + "T00:00:00")
                : new Date(formData.paybl_trdat)
              : null
          }
          onChange={(e) => onChange("paybl_trdat", e.target.value)}
          className={`w-full ${errors.paybl_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmtb_paybl.paybl_trdat.label}`}
        />
        <RequiredText text={errors.paybl_trdat} />
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="paybl_descr"
          className="block font-bold mb-2"
        >
          {tmtb_paybl.paybl_descr.label}
        </label>
        <InputText
          name="paybl_descr"
          value={formData.paybl_descr}
          onChange={(e) => onChange("paybl_descr", e.target.value)}
          className={`w-full ${errors.paybl_descr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_paybl.paybl_descr.label}`}
        />
        <RequiredText text={errors.paybl_descr} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="paybl_dbamt"
          className="block font-bold mb-2 text-red-800"
        >
          Amount
        </label>
        <InputNumber
          name="paybl_dbamt"
          value={formData.paybl_dbamt}
          onValueChange={(e) => onChange("paybl_dbamt", e.value)}
          className={`${errors.paybl_dbamt ? "p-invalid" : ""}`}
          style={{ width: "100%" }}
          inputStyle={{ width: "100%", textAlign: "right" }}
          variant="filled"
          mode="decimal"
          minFractionDigits={2}
          maxFractionDigits={2}
          locale="en"
        />
        <RequiredText text={errors.paybl_dbamt} />
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
