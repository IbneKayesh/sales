import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import tmeb_mbkng from "@/models/sales/tmeb_mbkng.json";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";
import RequiredText from "@/components/RequiredText";

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
    handleChange("mbkng_cntct", e.value);
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
        <label htmlFor="mbkng_trnno" className="block font-bold mb-2">
          {tmeb_mbkng.mbkng_trnno.label}
        </label>
        <InputText
          id="mbkng_trnno"
          name="mbkng_trnno"
          value={formData.mbkng_trnno}
          onChange={(e) => handleChange("mbkng_trnno", e.target.value)}
          className={`w-full ${errors.mbkng_trnno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmeb_mbkng.mbkng_trnno.label}`}
          disabled
          variant="filled"
        />
        <RequiredText text={errors.mbkng_trnno} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="mbkng_trdat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmeb_mbkng.mbkng_trdat.label}
        </label>
        <Calendar
          id="mbkng_trdat"
          name="mbkng_trdat"
          value={formData.mbkng_trdat ? new Date(formData.mbkng_trdat) : null}
          onChange={(e) =>
            handleChange(
              "mbkng_trdat",
              e.value ? e.value.toLocaleString().split("T")[0] : "",
            )
          }
          className={`w-full ${errors.mbkng_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmeb_mbkng.mbkng_trdat.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        <RequiredText text={errors.mbkng_trdat} />
      </div>
      <div className="col-12 md:col-5">
        <label
          htmlFor="mbkng_cntct"
          className="block font-bold mb-2 text-red-800"
        >
          {tmeb_mbkng.mbkng_cntct.label}
        </label>
        {isReadOnly ? (
          <InputText
            value={
              formData.cntct_cntnm +
              ", " +
              formData.cntct_cntno +
              ", " +
              formData.cntct_cntno +
              ", " +
              formData.cntct_ofadr
            }
            className="w-full"
            disabled
            variant="filled"
          />
        ) : (
          <Dropdown
            id="mbkng_cntct"
            name="mbkng_cntct"
            value={formData.mbkng_cntct}
            options={customerList}
            optionLabel="cntct_cntnm"
            optionValue="id"
            onChange={(e) => handleChange_cntct_cntnm(e)}
            className={`w-full ${errors.mbkng_cntct ? "p-invalid" : ""}`}
            placeholder={`Select ${tmeb_mbkng.mbkng_cntct.label}`}
            filter
            showClear
            itemTemplate={cntct_cntnm_IT}
            valueTemplate={cntct_cntnm_VT}
          />
        )}
        <RequiredText text={errors.mbkng_cntct} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="mbkng_refno" className="block font-bold mb-2">
          {tmeb_mbkng.mbkng_refno.label}
        </label>
        <InputText
          id="mbkng_refno"
          name="mbkng_refno"
          value={formData.mbkng_refno}
          onChange={(e) => handleChange("mbkng_refno", e.target.value)}
          className={`w-full ${errors.mbkng_refno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmeb_mbkng.mbkng_refno.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        <RequiredText text={errors.mbkng_refno} />
      </div>
      <div className="col-12 md:col-1">
        {isReadOnly ? (
          <>
            <label className="block font-bold mb-2">Posted</label>
            <div className="checkbox-container">
              <Tag
                severity="success"
                value="Posted"
                icon="pi pi-lock"
                className="w-full"
              />
            </div>
          </>
        ) : (
          <>
            <label htmlFor="mbkng_ispst" className="block font-bold mb-2">
              {tmeb_mbkng.mbkng_ispst.label}
            </label>
            <div className="checkbox-container">
              <Checkbox
                id="mbkng_ispst"
                name="mbkng_ispst"
                checked={formData.mbkng_ispst === 1}
                onChange={(e) => handleChange("mbkng_ispst", e.checked ? 1 : 0)}
                className={errors.mbkng_ispst ? "p-invalid" : ""}
              />
            </div>
            <RequiredText text={errors.mbkng_ispst} />
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderComp;
