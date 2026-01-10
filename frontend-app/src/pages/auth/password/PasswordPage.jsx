import { useChangePassword } from "@/hooks/setup/useChangePassword";
import PasswordFormComp from "./PasswordFormComp";
import { Card } from "primereact/card";

const PasswordPage = () => {
  const {
    isBusy,
    errors,
    formData,
    handleChange,
    handleSave,
    handleClear,
  } = useChangePassword();

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">Change Password</h3>
      </div>
    );
  };

  return (
    <>
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        <PasswordFormComp
          isBusy={isBusy}
          errors={errors}
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
          onClear={handleClear}
        />
      </Card>
    </>
  );
};

export default PasswordPage;
