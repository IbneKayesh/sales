import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";
import EmptyState from "@/components/EmptyState";
import { TreeSelect } from "primereact/treeselect";

const SearchComp = ({
  formData,
  errors,
  onChange,
  mjrnl_dpart_Options,
  mjrnl_fsyar_Options,
  mjrnl_acprd_Options,
  djrnl_chtac_Options,
  djrnl_party_Options,
}) => {
  return (
    <>
      <div className="grid">
        {/* {JSON.stringify(mjrnl_acprd_Options)} */}
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2 text-red-800">C/C</label>
          <Dropdown
            name="mjrnl_dpart"
            value={formData.mjrnl_dpart}
            onChange={(e) => onChange("mjrnl_dpart", e.value)}
            options={mjrnl_dpart_Options}
            optionLabel="dpart_dname"
            optionValue="id"
            className={`w-full ${errors.mjrnl_dpart ? "p-invalid" : ""}`}
            size={"small"}
            placeholder={`Enter C/C`}
            filter
            showClear
          />
          <RequiredText text={errors.mjrnl_dpart} />
        </div>
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2 text-red-800">
            Fiscal Year
          </label>
          <Dropdown
            name="mjrnl_fsyar"
            value={formData.mjrnl_fsyar}
            onChange={(e) => onChange("mjrnl_fsyar", e.value)}
            options={mjrnl_fsyar_Options}
            optionLabel="fsyar_fname"
            optionValue="id"
            className={`w-full ${errors.mjrnl_fsyar ? "p-invalid" : ""}`}
            size={"small"}
            placeholder={`Enter Fiscal Year`}
            filter
            showClear
          />
          <RequiredText text={errors.mjrnl_fsyar} />
        </div>
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2 text-red-800">Period</label>
          <Dropdown
            name="mjrnl_acprd"
            value={formData.mjrnl_acprd}
            onChange={(e) => onChange("mjrnl_acprd", e.value)}
            options={mjrnl_acprd_Options}
            optionLabel="acprd_pname"
            optionValue="id"
            className={`w-full ${errors.mjrnl_acprd ? "p-invalid" : ""}`}
            size={"small"}
            placeholder={`Enter Period`}
            filter
            showClear
          />
          <RequiredText text={errors.mjrnl_acprd} />
        </div>
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2 text-red-800">C/A</label>
          <TreeSelect
            value={formData.djrnl_chtac}
            options={djrnl_chtac_Options}
            onChange={(e) => onChange("djrnl_chtac", e.value)}
            placeholder="Select COA"
            className={`w-full ${errors.djrnl_chtac ? "p-invalid" : ""}`}
            size={"small"}
            filter
            showClear
          />
          <RequiredText text={errors.djrnl_chtac} />
        </div>
        <div className="col-12 md:col-3">
          <label className="block font-bold mb-2 text-red-800">Party</label>
          <Dropdown
            name="djrnl_party"
            value={formData.djrnl_party}
            onChange={(e) => onChange("djrnl_party", e.value)}
            options={djrnl_party_Options}
            optionLabel="label_text"
            optionValue="value_text"
            className={`w-full ${errors.djrnl_party ? "p-invalid" : ""}`}
            size={"small"}
            placeholder={`Enter party`}
            filter
            showClear
          />
          <RequiredText text={errors.djrnl_party} />
        </div>
      </div>
    </>
  );
};
export default SearchComp;
