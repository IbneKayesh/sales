import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import tmpb_mrcpt from "@/models/purchase/tmpb_mrcpt.json";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";
import RequiredText from "@/components/RequiredText";

const HeaderComp = ({ errors, formData, handleChange, fetchAvailableReceiptItems }) => {
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
    handleChange("mrcpt_cntct", e.value);
    const selectedObj = supplierList.find((c) => c.id === e.value);
    //console.log("selectedObj", selectedObj.credit_limit);
    handleChange("cntct_crlmt", selectedObj?.cntct_crlmt || 0);
    handleChange("cntct_cntnm", selectedObj?.cntct_cntnm || "");
    handleChange("cntct_cntno", selectedObj?.cntct_cntno || "");
    handleChange("cntct_ofadr", selectedObj?.cntct_ofadr || "");
    fetchAvailableReceiptItems(e.value);
  };

  const isReadOnly = formData.edit_stop === 1;

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label htmlFor="mrcpt_trnno" className="block font-bold mb-2">
          {tmpb_mrcpt.mrcpt_trnno.label}
        </label>
        <InputText
          id="mrcpt_trnno"
          name="mrcpt_trnno"
          value={formData.mrcpt_trnno}
          onChange={(e) => handleChange("mrcpt_trnno", e.target.value)}
          className={`w-full ${errors.mrcpt_trnno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmpb_mrcpt.mrcpt_trnno.label}`}
          disabled
          variant="filled"
        />
        <RequiredText text={errors.mrcpt_trnno} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="mrcpt_trdat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmpb_mrcpt.mrcpt_trdat.label}
        </label>
        <Calendar
          id="mrcpt_trdat"
          name="mrcpt_trdat"
          value={formData.mrcpt_trdat ? new Date(formData.mrcpt_trdat) : null}
          onChange={(e) =>
            handleChange(
              "mrcpt_trdat",
              e.value ? e.value.toLocaleString().split("T")[0] : ""
            )
          }
          className={`w-full ${errors.mrcpt_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmpb_mrcpt.mrcpt_trdat.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        <RequiredText text={errors.mrcpt_trdat} />
      </div>
      <div className="col-12 md:col-5">
        <label
          htmlFor="mrcpt_cntct"
          className="block font-bold mb-2 text-red-800"
        >
          {tmpb_mrcpt.mrcpt_cntct.label}
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
            id="mrcpt_cntct"
            name="mrcpt_cntct"
            value={formData.mrcpt_cntct}
            options={supplierList}
            optionLabel="cntct_cntnm"
            optionValue="id"
            onChange={(e) => handleChange_cntct_cntnm(e)}
            className={`w-full ${errors.mrcpt_cntct ? "p-invalid" : ""}`}
            placeholder={`Select ${tmpb_mrcpt.mrcpt_cntct.label}`}
            filter
            showClear
            itemTemplate={cntct_cntnm_IT}
            valueTemplate={cntct_cntnm_VT}
          />
        )}
        <RequiredText text={errors.mrcpt_cntct} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="mrcpt_refno" className="block font-bold mb-2">
          {tmpb_mrcpt.mrcpt_refno.label}
        </label>
        <InputText
          id="mrcpt_refno"
          name="mrcpt_refno"
          value={formData.mrcpt_refno}
          onChange={(e) => handleChange("mrcpt_refno", e.target.value)}
          className={`w-full ${errors.mrcpt_refno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmpb_mrcpt.mrcpt_refno.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        <RequiredText text={errors.mrcpt_refno} />
      </div>
      <div className="col-12 md:col-1">
        {/* default posted for purchase receipt */}
        {true ? (
          <>
            <label className="block font-bold mb-2">Posted</label>
            <Tag
              severity="success"
              value="Posted"
              icon="pi pi-lock"
              className="w-full py-1"
            />
          </>
        ) : ( 
          <>
            <label htmlFor="mrcpt_ispst" className="block font-bold mb-2">
              {tmpb_mrcpt.mrcpt_ispst.label}
            </label>
            <Checkbox
              id="mrcpt_ispst"
              name="mrcpt_ispst"
              checked={formData.mrcpt_ispst === 1}
              onChange={(e) =>
                handleChange("mrcpt_ispst", e.checked ? 1 : 0)
              }
              className={errors.mrcpt_ispst ? "p-invalid" : ""}
            />
            <RequiredText text={errors.mrcpt_ispst} />
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderComp;
