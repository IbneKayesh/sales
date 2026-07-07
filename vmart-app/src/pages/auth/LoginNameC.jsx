import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormField from "../../components/ui/FormField";
import { ROLES } from "../context/AuthContext";

export default function LoginNameC({ role, onRoleChange, name, onNameChange, onSubmit, disabled }) {
  const isShopOwner = role === ROLES.SHOP;

  return (
    <>
      <h3>Sign In</h3>
      <p>Enter your name to get started</p>
      <div className="auth-role-toggle">
        <button onClick={() => onRoleChange("CUSTOMER")}
          className={`auth-role-btn${role === "CUSTOMER" ? " auth-role-btn--active" : ""}`}>👤 Customer</button>
        <button onClick={() => onRoleChange("SHOP")}
          className={`auth-role-btn${role === "SHOP" ? " auth-role-btn--active" : ""}`}>🏪 Shop Owner</button>
      </div>
      <FormField label="Your Name" htmlFor="login-name">
        <Input id="login-name" name="login-name" placeholder="Full name" value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }} autoFocus />
      </FormField>
      <Button variant="primary" className="auth-btn-full" onClick={onSubmit} disabled={disabled}>Continue</Button>
    </>
  );
}
