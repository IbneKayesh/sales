import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import RequiredText from "@/components/RequiredText";

const SubCategoryFormComp = ({ formData, errors, onChange, catDataList }) => {
  const itcg_id_IT = (option) => {
    return (
      <div className="flex align-items-center">
        <div className="flex flex-column">
          <span className="font-bold">{option.itcg_name}</span>
          <small className="text-gray-500">Code: {option.itcg_code}</small>
        </div>
      </div>
    );
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Sub Category Name
        </label>
        <InputText
          name="itcl_name"
          value={formData.itcl_name}
          onChange={(e) => onChange("itcl_name", e.target.value)}
          className={`w-full ${errors.itcl_name ? "p-invalid" : ""}`}
          placeholder={`Enter sub category name`}
        />
        <RequiredText text={errors.itcl_name} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Order By</label>
        <InputText
          name="itcl_oseq"
          value={formData.itcl_oseq}
          onChange={(e) => onChange("itcl_oseq", e.target.value)}
          className={`w-full ${errors.itcl_oseq ? "p-invalid" : ""}`}
          placeholder={`Enter sequence no`}
        />
        <RequiredText text={errors.itcl_oseq} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Category</label>
        <Dropdown
          name="itcg_id"
          value={formData.itcg_id}
          onChange={(e) => onChange("itcg_id", e.value)}
          options={catDataList}
          optionLabel="itcg_name"
          optionValue="id"
          itemTemplate={itcg_id_IT}
          className={`w-full ${errors.itcg_id ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter category`}
          filter
          showClear
        />
        <RequiredText text={errors.itcg_id} />
      </div>
    </div>
  );
};
export default SubCategoryFormComp;
