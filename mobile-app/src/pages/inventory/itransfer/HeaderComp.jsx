import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";
import tmib_mtrsf from "@/models/inventory/tmib_mtrsf.json";
import { useBusinessSgd } from "@/hooks/setup/useBusinessSgd";
import RequiredText from "@/components/RequiredText";

const HeaderComp = ({ errors, formData, handleChange }) => {
  const { dataList: businessList, handleLoadBusiness } = useBusinessSgd();

  useEffect(() => {
    if (!formData.edit_stop) {
      handleLoadBusiness();
      //console.log("formData", formData);
    }
  }, []);

  const bsins_bname_IT = (option) => {
    return (
      <div className="flex flex-column">
        <div className="font-semibold">{option.bsins_bname}</div>
        <div className="text-sm text-gray-600">
          {option.bsins_addrs}, {option.bsins_email}
        </div>
        <div className="text-sm text-gray-600">{option.bsins_cntct}</div>
      </div>
    );
  };

  const bsins_bname_VT = (option) => {
    if (!option) {
      return "Select Business";
    }

    return (
      <div className="flex flex-column">
        <span className="font-semibold">
          {option.bsins_bname}, {option.bsins_addrs}
        </span>
      </div>
    );
  };

  const handleChange_cntct_cntnm = (e) => {
    handleChange("mtrsf_bsins_to", e.value);
    const selectedObj = businessList.find((c) => c.id === e.value);
    //console.log("selectedObj", selectedObj.credit_limit);
    handleChange("bsins_bname", selectedObj?.bsins_bname || "");
    handleChange("bsins_addrs", selectedObj?.bsins_addrs || "");
    handleChange("bsins_cntct", selectedObj?.bsins_cntct || "");
  };

  const isReadOnly = formData.edit_stop === 1;

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label htmlFor="mtrsf_trnno" className="block font-bold mb-2">
          {tmib_mtrsf.mtrsf_trnno.label}
        </label>
        <InputText
          id="mtrsf_trnno"
          name="mtrsf_trnno"
          value={formData.mtrsf_trnno}
          onChange={(e) => handleChange("mtrsf_trnno", e.target.value)}
          className={`w-full ${errors.mtrsf_trnno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_mtrsf.mtrsf_trnno.label}`}
          disabled
          variant="filled"
        />
        <RequiredText text={errors.mtrsf_trnno} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="mtrsf_trdat" className="block font-bold mb-2 text-red-800">
          {tmib_mtrsf.mtrsf_trdat.label}
        </label>
        <Calendar
          id="mtrsf_trdat"
          name="mtrsf_trdat"
          value={formData.mtrsf_trdat ? new Date(formData.mtrsf_trdat) : null}
          onChange={(e) =>
            handleChange(
              "mtrsf_trdat",
              e.value ? e.value.toLocaleString().split("T")[0] : "",
            )
          }
          className={`w-full ${errors.mtrsf_trdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmib_mtrsf.mtrsf_trdat.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        <RequiredText text={errors.mtrsf_trdat} />
      </div>
      <div className="col-12 md:col-5">
        <label htmlFor="mtrsf_bsins_to" className="block font-bold mb-2 text-red-800">
          {tmib_mtrsf.mtrsf_bsins_to.label}
        </label>
        {isReadOnly ? (
          <InputText
            value={
              formData.bsins_bname +
              ", " +
              formData.bsins_addrs +
              ", " +
              formData.bsins_cntct
            }
            className="w-full"
            disabled
            variant="filled"
          />
        ) : (
          <Dropdown
            id="mtrsf_bsins_to"
            name="mtrsf_bsins_to"
            value={formData.mtrsf_bsins_to}
            options={businessList}
            optionLabel="bsins_bname"
            optionValue="id"
            onChange={(e) => handleChange_cntct_cntnm(e)}
            className={`w-full ${errors.mtrsf_bsins_to ? "p-invalid" : ""}`}
            placeholder={`Select ${tmib_mtrsf.mtrsf_bsins_to.label}`}
            filter
            showClear
            itemTemplate={bsins_bname_IT}
            valueTemplate={bsins_bname_VT}
          />
        )}
        <RequiredText text={errors.mtrsf_bsins_to} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="mtrsf_refno" className="block font-bold mb-2">
          {tmib_mtrsf.mtrsf_refno.label}
        </label>
        <InputText
          id="mtrsf_refno"
          name="mtrsf_refno"
          value={formData.mtrsf_refno}
          onChange={(e) => handleChange("mtrsf_refno", e.target.value)}
          className={`w-full ${errors.mtrsf_refno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmib_mtrsf.mtrsf_refno.label}`}
          disabled={isReadOnly}
          variant={isReadOnly ? "filled" : "outlined"}
        />
        <RequiredText text={errors.mtrsf_refno} />
      </div>
      <div className="col-12 md:col-1">
        <label className="block font-bold mb-2">Posted</label>
        <Tag
          severity="success"
          value="Posted"
          icon="pi pi-lock"
          className="w-full py-1"
        />
      </div>
    </div>
  );
};

export default HeaderComp;
