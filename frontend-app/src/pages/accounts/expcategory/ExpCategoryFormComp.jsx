import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmtb_exctg from "@/models/accounts/tmtb_exctg.json";
import { useAccountsHeadsSgd } from "@/hooks/accounts/useAccountsHeadsSgd";
import { useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";

const ExpCategoryFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  const { dataList: exctg_trhedOptions, handleGetAllActiveHeads } =
    useAccountsHeadsSgd();
  useEffect(() => {
    handleGetAllActiveHeads();
  }, []);

  const ledgr_trhed_IT = (option) => {
    return (
      <div className="flex flex-column">
        <div className="font-semibold">{option.trhed_hednm}</div>
        <div className="text-sm text-gray-600">
          {option.trhed_grpnm} of {option.trhed_cntyp} will
        </div>
        {option.trhed_grtyp === "In" ? (
          <span className="text-blue-500">Increase Balance</span>
        ) : (
          <span className="text-orange-500">Decrease Balance</span>
        )}
      </div>
    );
  };

  const ledgr_trhed_VT = (option) => {
    if (!option) {
      return "Select Head";
    }

    return (
      <div className="flex flex-column">
        <span className="font-semibold">
          {option.trhed_grtyp === "In" ? (
            <span className="text-blue-600">
              {option.trhed_hednm}, {option.trhed_cntyp}
            </span>
          ) : (
            <span className="text-orange-600">
              {option.trhed_hednm}, {option.trhed_cntyp}
            </span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-4">
        <label
          htmlFor="exctg_trhed"
          className="block font-bold mb-2 text-red-800"
        >
          Head
        </label>
        <Dropdown
          name="exctg_trhed"
          value={formData.exctg_trhed}
          options={exctg_trhedOptions}
          optionLabel="trhed_hednm"
          optionValue="id"
          onChange={(e) => onChange("exctg_trhed", e.value)}
          className={`w-full ${errors.exctg_trhed ? "p-invalid" : ""}`}
          placeholder={`Enter head`}
          filter
          showClear
          itemTemplate={ledgr_trhed_IT}
          valueTemplate={ledgr_trhed_VT}
        />
        <RequiredText text={errors.exctg_trhed} />
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="exctg_cname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmtb_exctg.exctg_cname.label}
        </label>
        <InputText
          name="exctg_cname"
          value={formData.exctg_cname}
          onChange={(e) => onChange("exctg_cname", e.target.value)}
          className={`w-full ${errors.exctg_cname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmtb_exctg.exctg_cname.label}`}
        />
        {errors.exctg_cname && (
          <small className="mb-3 text-red-500">{errors.exctg_cname}</small>
        )}
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

export default ExpCategoryFormComp;
