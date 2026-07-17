import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { Dropdown } from "primereact/dropdown";
import AuditFields from "@/components/AuditFields";

const UsersFormComp = ({
  formData,
  errors,
  onChange,
  users_urole_Options,
  users_bsins_Options,
}) => {
  return (
    <div className="grid">
      {/* {JSON.stringify(formData)} */}
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Email/Login Id
        </label>
        <InputText
          name="users_email"
          value={formData.users_email}
          onChange={(e) => onChange("users_email", e.target.value)}
          className={`w-full ${errors.users_email ? "p-invalid" : ""}`}
          placeholder={`Enter email / login id`}
        />
        <RequiredText text={errors.users_email} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Password</label>
        <InputText
          name="users_pswrd"
          value={formData.users_pswrd}
          onChange={(e) => onChange("users_pswrd", e.target.value)}
          className={`w-full ${errors.users_pswrd ? "p-invalid" : ""}`}
          placeholder={`Enter password`}
        />
        <RequiredText text={errors.users_pswrd} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">
          Recovery Key
        </label>
        <InputText
          name="users_recky"
          value={formData.users_recky}
          onChange={(e) => onChange("users_recky", e.target.value)}
          className={`w-full ${errors.users_recky ? "p-invalid" : ""}`}
          placeholder={`Enter recovery key`}
        />
        <RequiredText text={errors.users_recky} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">User Name</label>
        <InputText
          name="users_uname"
          value={formData.users_uname}
          onChange={(e) => onChange("users_uname", e.target.value)}
          className={`w-full ${errors.users_uname ? "p-invalid" : ""}`}
          placeholder={`Enter user name`}
        />
        <RequiredText text={errors.users_uname} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Contact No</label>
        <InputText
          name="users_cntct"
          value={formData.users_cntct}
          onChange={(e) => onChange("users_cntct", e.target.value)}
          className={`w-full ${errors.users_cntct ? "p-invalid" : ""}`}
          placeholder={`Enter contact no`}
        />
        <RequiredText text={errors.users_cntct} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Reg No</label>
        <InputText
          name="users_regno"
          value={formData.users_regno}
          onChange={(e) => onChange("users_regno", e.target.value)}
          className={`w-full ${errors.users_regno ? "p-invalid" : ""}`}
          placeholder={`Enter reg no`}
        />
        <RequiredText text={errors.users_regno} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2">Notes</label>
        <InputText
          name="users_notes"
          value={formData.users_notes}
          onChange={(e) => onChange("users_notes", e.target.value)}
          className={`w-full ${errors.users_notes ? "p-invalid" : ""}`}
          placeholder={`Enter notes`}
        />
        <RequiredText text={errors.users_notes} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Server Link</label>
        <InputText
          name="users_apink"
          value={formData.users_apink}
          onChange={(e) => onChange("users_apink", e.target.value)}
          className={`w-full ${errors.users_apink ? "p-invalid" : ""}`}
          placeholder={`Enter server link`}
        />
        <RequiredText text={errors.users_apink} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Role</label>
        <Dropdown
          name="users_urole"
          value={formData.users_urole}
          onChange={(e) => onChange("users_urole", e.value)}
          options={users_urole_Options}
          optionLabel="label_text"
          optionValue="value_text"
          className={`w-full ${errors.users_urole ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter role`}
          filter
          showClear
        />
        <RequiredText text={errors.users_urole} />
      </div>
      <div className="col-12 md:col-2">
        <label className="block font-bold mb-2 text-red-800">Business</label>
        <Dropdown
          name="users_bsins"
          value={formData.users_bsins}
          onChange={(e) => onChange("users_bsins", e.value)}
          options={users_bsins_Options}
          optionLabel="bsins_bname"
          optionValue="id"
          className={`w-full ${errors.users_bsins ? "p-invalid" : ""}`}
          size={"small"}
          placeholder={`Enter business`}
          filter
          showClear
        />
        <RequiredText text={errors.users_bsins} />
      </div>

      {formData.id && (
        <AuditFields
          active={formData.users_actve}
          createdBy={formData.crusr_cname}
          createdAt={formData.users_crdat}
          updatedBy={formData.upusr_cname}
          updatedAt={formData.users_updat}
          revNo={formData.users_rvnmr}
        />
      )}
    </div>
  );
};
export default UsersFormComp;
