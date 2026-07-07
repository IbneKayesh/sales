import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormField from "../../components/ui/FormField";

export default function LoginVerifyC({
  name, isShopOwner, loginPassword, onLoginPasswordChange, onVerify,
  resolvedQuestion, onBackToName, onForgot, onSetNewOne, isBusy,
}) {
  return (
    <>
      <h3>Welcome Back!</h3>
      <p className="auth-subtle-text">
        {isShopOwner ? "🏪 " : "👤 "}{name}
        <button onClick={onBackToName} className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--ml">(Not you?)</button>
      </p>
      <FormField label="Password" htmlFor="verify-password">
        <Input type="password" id="verify-password" name="verify-password" placeholder="Enter your password"
          value={loginPassword} onChange={(e) => onLoginPasswordChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onVerify(); }} autoFocus />
      </FormField>
      <Button variant="primary" className="auth-btn-full" onClick={onVerify} disabled={!loginPassword.trim() || isBusy}>Sign In</Button>
      {resolvedQuestion ? (
        <p className="auth-muted-text">
          Forgot your password?
          <button onClick={onForgot} className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--bold auth-ghost-btn--ml4">Reset with security question</button>
        </p>
      ) : (
        <p className="auth-muted-text">
          Forgot your password?
          <button onClick={onSetNewOne} className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--bold auth-ghost-btn--ml4">Set a new one</button>
        </p>
      )}
    </>
  );
}
