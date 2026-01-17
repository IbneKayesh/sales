import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
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

  const isReadOnly = formData.edit_stop === 1;

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label htmlFor="pmstr_trnno" className="block font-bold mb-2">
          {tmpb_pmstr.pmstr_trnno.label}
        </label>
        <InputText
          id="pmstr_trnno"
          name="pmstr_trnno"
          value={formData.pmstr_trnno}
          onChange={(e) => handleChange("pmstr_trnno", e.target.value)}
          className={`w-full ${errors.pmstr_trnno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmpb_pmstr.pmstr_trnno.label}`}
          disabled
          variant="filled"
        />
        {errors.pmstr_trnno && (
          <small className="mb-3 text-red-500">{errors.pmstr_trnno}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="pmstr_trdat" className="block font-bold mb-2">
          {tmpb_pmstr.pmstr_trdat.label}
          {!isReadOnly && <span className="text-red-500">*</span>}
        </label>
        <Calendar
          id="pmstr_trdat"
          name="pmstr_trdat"
          value={formData.pmstr_trdat ? new Date(formData.pmstr_trdat) : null}
          onChange={(e) =>
            handleChange(
              "pmstr_trdat",
              e.value ? e.value.toLocaleString().split("T")[0] : ""
            )
          }
          className={`w-full ${errors.pmstr_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmpb_pmstr.pmstr_trdat.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        {errors.pmstr_trdat && (
          <small className="mb-3 text-red-500">{errors.pmstr_trdat}</small>
        )}
      </div>
      <div className="col-12 md:col-5">
        <label htmlFor="pmstr_cntct" className="block font-bold mb-2">
          {tmpb_pmstr.pmstr_cntct.label}
          {!isReadOnly && <span className="text-red-500">*</span>}
        </label>
        {isReadOnly ? (
          <InputText
            value={formData.cntct_cntnm + ", " + formData.cntct_cntno + ", " + formData.cntct_cntno + ", " + formData.cntct_ofadr}
            className="w-full"
            disabled
            variant="filled"
          />
        ) : (
          <Dropdown
            id="pmstr_cntct"
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
        )}
        {errors.pmstr_cntct && (
          <small className="mb-3 text-red-500">{errors.pmstr_cntct}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="pmstr_refno" className="block font-bold mb-2">
          {tmpb_pmstr.pmstr_refno.label}
        </label>
        <InputText
          id="pmstr_refno"
          name="pmstr_refno"
          value={formData.pmstr_refno}
          onChange={(e) => handleChange("pmstr_refno", e.target.value)}
          className={`w-full ${errors.pmstr_refno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmpb_pmstr.pmstr_refno.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        {errors.pmstr_refno && (
          <small className="mb-3 text-red-500">{errors.pmstr_refno}</small>
        )}
      </div>
      <div className="col-12 md:col-1">
        {isReadOnly ? (
          <>
            <label className="block font-bold mb-2">Posted</label>
            <Tag
              severity="success"
              value="Posted"
              icon="pi pi-lock"
              className="w-full py-2"
            />
          </>
        ) : (
          <>
            <label htmlFor="pmstr_ispst" className="block font-bold mb-2">
              {tmpb_pmstr.pmstr_ispst.label}
            </label>
            <Checkbox
              id="pmstr_ispst"
              name="pmstr_ispst"
              checked={formData.pmstr_ispst === 1}
              onChange={(e) =>
                handleChange("pmstr_ispst", e.checked ? 1 : 0)
              }
              className={errors.pmstr_ispst ? "p-invalid" : ""}
            />
            {errors.pmstr_ispst && (
              <small className="mb-3 text-red-500">{errors.pmstr_ispst}</small>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderComp;
