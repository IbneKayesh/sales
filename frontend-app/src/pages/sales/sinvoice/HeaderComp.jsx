import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import tmeb_minvc from "@/models/sales/tmeb_minvc.json";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";

const HeaderComp = ({ errors, formData, handleChange }) => {
  const { dataList: customerList, handleLoadCustomers } = useContactsSgd();

  useEffect(() => {
    if (!formData.edit_stop) {
      handleLoadCustomers();
      //console.log("Customer list loaded");
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
    handleChange("minvc_cntct", e.value);
    const selectedObj = customerList.find((c) => c.id === e.value);
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
        <label htmlFor="minvc_trnno" className="block font-bold mb-2">
          {tmeb_minvc.minvc_trnno.label}
        </label>
        <InputText
          id="minvc_trnno"
          name="minvc_trnno"
          value={formData.minvc_trnno}
          onChange={(e) => handleChange("minvc_trnno", e.target.value)}
          className={`w-full ${errors.minvc_trnno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmeb_minvc.minvc_trnno.label}`}
          disabled
          variant="filled"
        />
        {errors.minvc_trnno && (
          <small className="mb-3 text-red-500">{errors.minvc_trnno}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="minvc_trdat" className="block font-bold mb-2">
          {tmeb_minvc.minvc_trdat.label}
          {!isReadOnly && <span className="text-red-500">*</span>}
        </label>
        <Calendar
          id="minvc_trdat"
          name="minvc_trdat"
          value={formData.minvc_trdat ? new Date(formData.minvc_trdat) : null}
          onChange={(e) =>
            handleChange(
              "minvc_trdat",
              e.value ? e.value.toLocaleString().split("T")[0] : ""
            )
          }
          className={`w-full ${errors.minvc_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmeb_minvc.minvc_trdat.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        {errors.minvc_trdat && (
          <small className="mb-3 text-red-500">{errors.minvc_trdat}</small>
        )}
      </div>
      <div className="col-12 md:col-5">
        <label htmlFor="minvc_cntct" className="block font-bold mb-2">
          {tmeb_minvc.minvc_cntct.label}
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
            id="minvc_cntct"
            name="minvc_cntct"
            value={formData.minvc_cntct}
            options={customerList}
            optionLabel="cntct_cntnm"
            optionValue="id"
            onChange={(e) => handleChange_cntct_cntnm(e)}
            className={`w-full ${errors.minvc_cntct ? "p-invalid" : ""}`}
            placeholder={`Select ${tmeb_minvc.minvc_cntct.label}`}
            filter
            showClear
            itemTemplate={cntct_cntnm_IT}
            valueTemplate={cntct_cntnm_VT}
          />
        )}
        {errors.minvc_cntct && (
          <small className="mb-3 text-red-500">{errors.minvc_cntct}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="minvc_refno" className="block font-bold mb-2">
          {tmeb_minvc.minvc_refno.label}
        </label>
        <InputText
          id="minvc_refno"
          name="minvc_refno"
          value={formData.minvc_refno}
          onChange={(e) => handleChange("minvc_refno", e.target.value)}
          className={`w-full ${errors.minvc_refno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmeb_minvc.minvc_refno.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        {errors.minvc_refno && (
          <small className="mb-3 text-red-500">{errors.minvc_refno}</small>
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
            <label htmlFor="minvc_ispst" className="block font-bold mb-2">
              {tmeb_minvc.minvc_ispst.label}
            </label>
            <Checkbox
              id="minvc_ispst"
              name="minvc_ispst"
              checked={formData.minvc_ispst === 1}
              onChange={(e) =>
                handleChange("minvc_ispst", e.checked ? 1 : 0)
              }
              className={errors.minvc_ispst ? "p-invalid" : ""}
            />
            {errors.minvc_ispst && (
              <small className="mb-3 text-red-500">{errors.minvc_ispst}</small>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderComp;
