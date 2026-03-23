import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmtb_exptr from "@/models/accounts/tmtb_exptr.json";
import RequiredText from "@/components/RequiredText";
import { InputNumber } from "primereact/inputnumber";
import { paymentModeOptions } from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";
import { useExpCategorySgd } from "@/hooks/accounts/useExpCategorySgd";
import { useEffect } from "react";

const ExpensesFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { dataList: categoryOptions, handleGetAllActiveCategory } =
    useExpCategorySgd();

  useEffect(() => {
    handleGetAllActiveCategory();
  }, []);

  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label
          htmlFor="exptr_exctg"
          className="block font-bold mb-2 text-red-800"
        >
          Category
        </label>
        <Dropdown
          name="exptr_exctg"
          value={formData.exptr_exctg}
          options={categoryOptions} 
          optionLabel="exctg_cname"
          optionValue="id"
          onChange={(e) => onChange("exptr_exctg", e.value)}
          className={`w-full ${errors.exptr_exctg ? "p-invalid" : ""}`}
          placeholder={`Select Category`}
          filter
          showClear
        />
        <RequiredText text={errors.exptr_exctg} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="exptr_trdat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_exptr.exptr_trdat.label}
        </label>
        <Calendar
          name="exptr_trdat"
          value={
            formData.exptr_trdat
              ? typeof formData.exptr_trdat === "string" &&
                !formData.exptr_trdat.includes("T")
                ? new Date(formData.exptr_trdat + "T00:00:00")
                : new Date(formData.exptr_trdat)
              : null
          }
          onChange={(e) => onChange("exptr_trdat", e.target.value)}
          className={`w-full ${errors.exptr_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmtb_exptr.exptr_trdat.label}`}
          variant="filled"
        />
        <RequiredText text={errors.exptr_trdat} />
      </div>
      <div className="col-12 md:col-5">
        <label
          htmlFor="exptr_trnte"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_exptr.exptr_trnte.label}
        </label>
        <InputText
          name="exptr_trnte"
          value={formData.exptr_trnte}
          onChange={(e) => onChange("exptr_trnte", e.target.value)}
          className={`w-full ${errors.exptr_trnte ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_exptr.exptr_trnte.label}`}
        />
        <RequiredText text={errors.exptr_trnte} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="exptr_examt"
          className="block font-bold mb-2 text-red-800"
        >
          Amount
        </label>
        <InputNumber
          name="exptr_examt"
          value={formData.exptr_examt}
          onValueChange={(e) => onChange("exptr_examt", e.value)}
          className={`${errors.exptr_examt ? "p-invalid" : ""}`}
          style={{ width: "100%" }}
          inputStyle={{ width: "100%", textAlign: "right" }}
          mode="decimal"
          minFractionDigits={2}
          maxFractionDigits={2}
          locale="en"
        />
        <RequiredText text={errors.exptr_examt} />
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

export default ExpensesFormComp;
