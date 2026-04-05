import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmcb_dlvan from "@/models/crm/tmcb_dlvan.json";
import RequiredText from "@/components/RequiredText";
import { useContactsSgd } from "@/hooks/crm/useContactsSgd";
import { useEffect } from "react";
import { Dropdown } from "primereact/dropdown";

const DeliveryVanFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  const { dataList: distributorOptions, handleGetAllActiveDistributors } =
    useContactsSgd();

  useEffect(() => {
    handleGetAllActiveDistributors();
  }, []);

  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label
          htmlFor="dlvan_distr"
          className="font-medium text-700 mb-2 block text-red-800"
        >
          Distributor
        </label>
        <Dropdown
          name="dlvan_distr"
          value={formData.dlvan_distr}
          options={distributorOptions}
          onChange={(e) => onChange("dlvan_distr", e.value)}
          className={`w-full ${errors.dlvan_distr ? "p-invalid" : ""}`}
          placeholder={`Select Distributor`}
          optionLabel="cntct_cntnm"
          optionValue="id"
        />
      </div>

      <div className="col-12 md:col-4">
        <label
          htmlFor="dlvan_vname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_dlvan.dlvan_vname.label}
        </label>
        <InputText
          name="dlvan_vname"
          value={formData.dlvan_vname}
          onChange={(e) => onChange("dlvan_vname", e.target.value)}
          className={`w-full ${errors.dlvan_vname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_dlvan.dlvan_vname.label}`}
        />
        <RequiredText text={errors.dlvan_vname} />
      </div>
      <div className="col-12 md:col-4">
        <label htmlFor="dlvan_dname" className="block font-bold mb-2">
          {tmcb_dlvan.dlvan_dname.label}
        </label>
        <InputText
          name="dlvan_dname"
          value={formData.dlvan_dname}
          onChange={(e) => onChange("dlvan_dname", e.target.value)}
          className={`w-full ${errors.dlvan_dname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_dlvan.dlvan_dname.label}`}
        />
        <RequiredText text={errors.dlvan_dname} />
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

export default DeliveryVanFormComp;
