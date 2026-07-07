import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormField from "../../components/ui/FormField";

export default function LoginForgotC({
  name, isShopOwner, resolvedQuestion, forgotAnswer, onForgotAnswerChange,
  forgotNewPw, onForgotNewPwChange, forgotConfirmPw, onForgotConfirmPwChange,
  forgotVerified, onForgotSubmit, onForgotReset, onBackToName, onRegister, isBusy,
}) {
  return (
    <>
      <h3>Reset Password</h3>
      <p className="auth-subtle-text">
        {isShopOwner ? "🏪 " : "👤 "}{name}
        <button onClick={onBackToName} className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--ml">(Not you?)</button>
      </p>

      {!forgotVerified ? (
        <>
          <div className="ui-card auth-security-card">
            <p className="auth-security-label">🔒 Security Question</p>
            <p className="auth-security-question">{resolvedQuestion || "No security question set."}</p>
          </div>

          {resolvedQuestion && (
            <>
              <FormField label="Your Answer" htmlFor="forgot-answer">
                <Input id="forgot-answer" name="forgot-answer" placeholder="Type your answer" value={forgotAnswer}
                  onChange={(e) => onForgotAnswerChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") onForgotSubmit(); }} autoFocus />
              </FormField>
              <Button variant="primary" className="auth-btn-full" onClick={onForgotSubmit} disabled={!forgotAnswer.trim() || isBusy}>Verify Answer</Button>
            </>
          )}

          {!resolvedQuestion && (
            <p className="auth-muted-text">
              No security question is set for this account.<br />
              <button onClick={onRegister} className="auth-ghost-btn auth-ghost-btn--md auth-ghost-btn--bold auth-ghost-btn--mt">Set a new password without verification</button>
            </p>
          )}

          <p className="auth-muted-text">
            <button onClick={onBackToName} className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--bold">← Back to login</button>
          </p>
        </>
      ) : (
        <>
          <p className="auth-success-text">✅ Answer verified! Set your new password below.</p>
          <FormField label="New Password" htmlFor="forgot-new-pw">
            <Input type="password" id="forgot-new-pw" name="forgot-new-pw" placeholder="Enter new password (min 4 chars)"
              value={forgotNewPw} onChange={(e) => onForgotNewPwChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && forgotNewPw === forgotConfirmPw) onForgotReset(); }} autoFocus />
          </FormField>
          <FormField label="Confirm New Password" htmlFor="forgot-confirm-pw">
            <Input type="password" id="forgot-confirm-pw" name="forgot-confirm-pw" placeholder="Confirm new password"
              value={forgotConfirmPw} onChange={(e) => onForgotConfirmPwChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && forgotNewPw === e.target.value) onForgotReset(); }} />
          </FormField>
          <Button variant="primary" className="auth-btn-full" onClick={onForgotReset}
            disabled={!forgotNewPw.trim() || forgotNewPw !== forgotConfirmPw || isBusy}>Reset Password</Button>
        </>
      )}
    </>
  );
}
