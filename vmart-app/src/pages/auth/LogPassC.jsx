import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormField from "../../components/ui/FormField";

export default function LogPassC({
  formData,
  onChangeMobileNo,
  onChange,
  onSubmitLogin,
  onForgotPassword,
}) {
  return (
    <>
      <p className="auth-subtle-text">
        <button
          onClick={onChangeMobileNo}
          className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--ml"
        >
          (Not you?)
        </button>
      </p>
      <FormField label="Password" htmlFor="users_pswrd">
        <Input
          type="password"
          name="users_pswrd"
          placeholder="Enter your password"
          value={formData.users_pswrd}
          onChange={(e) => onChange("users_pswrd", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmitLogin();
          }}
          autoFocus
        />
      </FormField>
      <p className="auth-muted-text">
        Forgot your password?
        <button
          onClick={onForgotPassword}
          className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--bold auth-ghost-btn--ml4"
        >
          Reset with security question
        </button>
      </p>
    </>
  );
}
