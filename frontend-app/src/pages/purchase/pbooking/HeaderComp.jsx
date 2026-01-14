import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import tmpb_pmstr from "@/models/purchase/tmpb_pmstr.json";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";

const HeaderComp = ({ errors, formData, handleChange }) => {
  const { dataList: supplierList, handleLoadSuppliers } = useContactsSgd();

  useEffect(() => {
    if (!formData.edit_stop) {
      handleLoadSuppliers();
      //console.log("Supplier list loaded");
    }
  }, []);

  const cntct_cntnm_IT = (option) => {
    return (
      <div className="flex flex-column">
        <div className="font-semibold">{option.cntct_cntnm}</div>
        <div className="text-sm text-gray-600">
          {option.cntct_cntps}, {option.cntct_cntno}
        </div>
        <div className="text-sm text-gray-600">{option.cntct_ofadr}</div>
        <div className="text-sm">
          Credit Limit:{" "}
          {option.cntct_crlmt > 0 ? (
            <>
              <i className="pi pi-credit-card mr-2 text-green-600 font-bold"></i>
              {Number(option.cntct_crlmt).toFixed(2)}
            </>
          ) : (
            <>
              <i className="pi pi-credit-card mr-2 text-red-600 font-bold"></i>
              {Number(option.cntct_crlmt).toFixed(2)}
            </>
          )}
        </div>
      </div>
    );
  };

  const cntct_cntnm_VT = (option) => {
    if (!option) {
      return "Select Contact";
    }

    return (
      <div className="flex flex-column">
        <span className="font-semibold">
          {option.cntct_crlmt > 0 ? (
            <i className="pi pi-credit-card mr-2 text-green-600"></i>
          ) : (
            <i className="pi pi-credit-card mr-2 text-red-600"></i>
          )}
          {option.cntct_cntnm}
        </span>
      </div>
    );
  };

  const handleChange_cntct_cntnm = (e) => {
    handleChange("pmstr_cntct", e.value);
    const selectedObj = supplierList.find((c) => c.id === e.value);
    //console.log("selectedObj", selectedObj.credit_limit);
    handleChange("cntct_crlmt", selectedObj?.cntct_crlmt || 0);
    handleChange("cntct_cntnm", selectedObj?.cntct_cntnm || "");
    handleChange("cntct_cntno", selectedObj?.cntct_cntno || "");
    handleChange("cntct_ofadr", selectedObj?.cntct_ofadr || "");
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="pmstr_trnno"
          className="block text-900 font-medium mb-2"
        >
          {tmpb_pmstr.pmstr_trnno.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="pmstr_trnno"
          value={formData.pmstr_trnno}
          onChange={(e) => handleChange("pmstr_trnno", e.target.value)}
          className={`w-full ${errors.pmstr_trnno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmpb_pmstr.pmstr_trnno.label}`}
          disabled
        />
        {errors.pmstr_trnno && (
          <small className="mb-3 text-red-500">{errors.pmstr_trnno}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="pmstr_trdat"
          className="block text-900 font-medium mb-2"
        >
          {tmpb_pmstr.pmstr_trdat.label}
          <span className="text-red-500">*</span>
        </label>
        <Calendar
          name="pmstr_trdat"
          value={formData.pmstr_trdat ? new Date(formData.pmstr_trdat) : null}
          onChange={(e) =>
            handleChange(
              "pmstr_trdat",
              e.value ? e.value.toISOString().split("T")[0] : ""
            )
          }
          className={`w-full ${errors.pmstr_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmpb_pmstr.pmstr_trdat.label}`}
        />
        {errors.pmstr_trdat && (
          <small className="mb-3 text-red-500">{errors.pmstr_trdat}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="pmstr_cntct"
          className="block text-900 font-medium mb-2"
        >
          {tmpb_pmstr.pmstr_cntct.label}
          <span className="text-red-500">*</span>
        </label>
        <Dropdown
          name="pmstr_cntct"
          value={formData.pmstr_cntct}
          options={supplierList}
          optionLabel="cntct_cntnm"
          optionValue="id"
          onChange={(e) => handleChange_cntct_cntnm(e)}
          className={`w-full ${errors.pmstr_cntct ? "p-invalid" : ""}`}
          placeholder={`Select ${tmpb_pmstr.pmstr_cntct.label}`}
          filter
          showClear
          itemTemplate={cntct_cntnm_IT}
          valueTemplate={cntct_cntnm_VT}
        />
        {errors.pmstr_cntct && (
          <small className="mb-3 text-red-500">{errors.pmstr_cntct}</small>
        )}
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="pmstr_trnte"
          className="block text-900 font-medium mb-2"
        >
          {tmpb_pmstr.pmstr_trnte.label}
        </label>
        <InputText
          name="pmstr_trnte"
          value={formData.pmstr_trnte}
          onChange={(e) => handleChange("pmstr_trnte", e.target.value)}
          className={`w-full ${errors.pmstr_trnte ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmpb_pmstr.pmstr_trnte.label}`}
        />
        {errors.pmstr_trnte && (
          <small className="mb-3 text-red-500">{errors.pmstr_trnte}</small>
        )}
      </div>
      <div className="col-12 md:col-1">
        <label
          htmlFor="pmstr_ispst"
          className="block text-900 font-medium mb-2"
        >
          {tmpb_pmstr.pmstr_ispst.label}
        </label>
        <Checkbox
          name="pmstr_ispst"
          checked={formData.pmstr_ispst === "1"}
          onChange={(e) => handleChange("pmstr_ispst", e.checked ? "1" : "0")}
          className={errors.pmstr_ispst ? "p-invalid" : ""}
        />
        {errors.pmstr_ispst && (
          <small className="text-red-500">{errors.pmstr_ispst}</small>
        )}
      </div>
    </div>
  );
};

export default HeaderComp;
