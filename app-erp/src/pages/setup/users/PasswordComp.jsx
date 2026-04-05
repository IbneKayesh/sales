import { usePassword } from "@/hooks/setup/usePassword";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const PasswordComp = ({ visible, setVisible }) => {
  const { isBusy, errors, formData, handleChange, handleSave } = usePassword();

  const onSave = async (e) => {
    const response = await handleSave(e);
    if (response && response.success) {
      setVisible(false);
    }
  };

  return (
    <Dialog
      header="Change Password"
      visible={visible}
      onHide={() => setVisible(false)}
      className="w-full md:w-30rem"
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
    >
      <form onSubmit={onSave} className="p-fluid grid px-2">
        <div className="col-12">
          <label
            htmlFor="pswrd_current"
            className="block text-900 font-medium mb-1"
          >
            Current Password <span className="text-red-500">*</span>
          </label>
          <Password
            id="pswrd_current"
            name="pswrd_current"
            value={formData.pswrd_current}
            onChange={(e) => handleChange("pswrd_current", e.target.value)}
            className={errors.pswrd_current ? "p-invalid" : ""}
            placeholder="Enter current password"
            feedback={false}
            toggleMask
            autoComplete="off"
          />
          {errors.pswrd_current && (
            <small className="p-error block mt-1">{errors.pswrd_current}</small>
          )}
        </div>

        <div className="col-12">
          <label
            htmlFor="pswrd_new"
            className="block text-900 font-medium mb-1"
          >
            New Password <span className="text-red-500">*</span>
          </label>
          <Password
            id="pswrd_new"
            name="pswrd_new"
            value={formData.pswrd_new}
            onChange={(e) => handleChange("pswrd_new", e.target.value)}
            className={errors.pswrd_new ? "p-invalid" : ""}
            placeholder="Enter new password"
            feedback={true}
            toggleMask
            autoComplete="new-password"
          />
          {errors.pswrd_new && (
            <small className="p-error block mt-1">{errors.pswrd_new}</small>
          )}
        </div>

        <div className="col-12">
          <label
            htmlFor="pswrd_confirm"
            className="block text-900 font-medium mb-1"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <Password
            id="pswrd_confirm"
            name="pswrd_confirm"
            value={formData.pswrd_confirm}
            onChange={(e) => handleChange("pswrd_confirm", e.target.value)}
            className={errors.pswrd_confirm ? "p-invalid" : ""}
            placeholder="Confirm new password"
            feedback={false}
            toggleMask
            autoComplete="new-password"
          />
          {errors.pswrd_confirm && (
            <small className="p-error block mt-1">
              {errors.pswrd_confirm}
            </small>
          )}
        </div>

        <div className="col-12 flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancel"
            icon="pi pi-times"
            onClick={() => setVisible(false)}
            className="p-button-text p-button-secondary w-auto"
          />
          <Button
            type="submit"
            label="Change Password"
            icon={"pi pi-check"}
            severity="success"
            loading={isBusy}
            className="w-auto"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default PasswordComp;
