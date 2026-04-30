import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";

const SupplierFormComp = ({ formData, errors, onChange, acmpDataList }) => {
  const acmp_id_IT = (option) => {
    return (
      <div className="flex align-items-center">
        <div className="flex flex-column">
          <span className="font-bold">{option.acmp_name}</span>
          <small className="text-gray-500">Code: {option.acmp_code}</small>
          <small className="text-gray-500">Address: {option.acmp_addr}</small>
        </div>
      </div>
    );
  };


  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">
          Supplier Name
        </label>
        <InputText
          name="supl_name"
          value={formData.supl_name}
          onChange={(e) => onChange("supl_name", e.target.value)}
          className={`w-full ${errors.supl_name ? "p-invalid" : ""}`}
          placeholder={`Enter supplier name`}
        />
        <RequiredText text={errors.supl_name} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">
          Owner/Manager
        </label>
        <InputText
          name="supl_ownm"
          value={formData.supl_ownm}
          onChange={(e) => onChange("supl_ownm", e.target.value)}
          className={`w-full ${errors.supl_ownm ? "p-invalid" : ""}`}
          placeholder={`Enter owner/manager name`}
        />
        <RequiredText text={errors.supl_ownm} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Mobile</label>
        <InputText
          name="supl_mob1"
          value={formData.supl_mob1}
          onChange={(e) => onChange("supl_mob1", e.target.value)}
          className={`w-full ${errors.supl_mob1 ? "p-invalid" : ""}`}
          placeholder={`Enter mobile`}
        />
        <RequiredText text={errors.supl_mob1} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Email</label>
        <InputText
          name="supl_mail"
          value={formData.supl_mail}
          onChange={(e) => onChange("supl_mail", e.target.value)}
          className={`w-full ${errors.supl_mail ? "p-invalid" : ""}`}
          placeholder={`Enter email`}
        />
        <RequiredText text={errors.supl_mail} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Address</label>
        <InputText
          name="supl_adrs"
          value={formData.supl_adrs}
          onChange={(e) => onChange("supl_adrs", e.target.value)}
          className={`w-full ${errors.supl_adrs ? "p-invalid" : ""}`}
          placeholder={`Enter address`}
        />
        <RequiredText text={errors.supl_adrs} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">VAT/TRN/BIN</label>
        <InputText
          name="supl_vatt"
          value={formData.supl_vatt}
          onChange={(e) => onChange("supl_vatt", e.target.value)}
          className={`w-full ${errors.supl_vatt ? "p-invalid" : ""}`}
          placeholder={`Enter BIN/TRN/VAT`}
        />
        <RequiredText text={errors.supl_vatt} />
      </div>
      <div className="col-12 md:col-3">
        <label className="block font-bold mb-2 text-red-800">Company</label>
        <Dropdown
          name="acmp_id"
          value={formData.acmp_id}
          onChange={(e) => onChange("acmp_id", e.value)}
          options={acmpDataList}
          optionLabel="acmp_name"
          optionValue="id"
          itemTemplate={acmp_id_IT}
          className={`w-full ${errors.acmp_id ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter Company`}
          filter
          showClear
        />
        <RequiredText text={errors.acmp_id} />
      </div>
    </div>
  );
};
export default SupplierFormComp;
