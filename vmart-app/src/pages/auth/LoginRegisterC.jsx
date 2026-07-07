import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import FormField from "../../components/ui/FormField";

export default function LoginRegisterC({
  name, onNameChange, isShopOwner, existingUser, shopName, onShopNameChange,
  shopDescription, onShopDescriptionChange, contact, onContactChange, address, onAddressChange,
  password, onPasswordChange, confirmPassword, onConfirmPasswordChange,
  securityQuestion, onSecurityQuestionChange, securityAnswer, onSecurityAnswerChange,
  customQuestion, onCustomQuestionChange, onRegister, onBackToName, securityQuestions, isBusy,
}) {
  return (
    <>
      <h3>{existingUser ? "Update Your Profile" : "Create Your Account"}</h3>
      <p>{existingUser ? "Set or update your account details." : "Fill in your details to continue."}</p>

      <FormField label="Your Name" htmlFor="register-name">
        <Input id="register-name" name="register-name" placeholder="Full name" value={name}
          onChange={(e) => onNameChange(e.target.value)} disabled={!!existingUser}
          className={existingUser ? "auth-input-disabled" : ""} />
        {existingUser && <span className="auth-hint">Name cannot be changed. Use a different name by going back.</span>}
      </FormField>

      {isShopOwner && (
        <FormField label="Shop Name" htmlFor="register-shop-name">
          <Input id="register-shop-name" name="register-shop-name" placeholder="Your shop name"
            value={shopName} onChange={(e) => onShopNameChange(e.target.value)} />
        </FormField>
      )}

      {isShopOwner && (
        <FormField label="Shop Description (optional)" htmlFor="register-shop-desc">
          <Textarea id="register-shop-desc" name="register-shop-desc" placeholder="What does your shop offer?" rows={2}
            value={shopDescription} onChange={(e) => onShopDescriptionChange(e.target.value)} />
        </FormField>
      )}

      <FormField label="Contact (optional)" htmlFor="register-contact">
        <Input type="tel" id="register-contact" name="register-contact" placeholder="Phone number"
          value={contact} onChange={(e) => onContactChange(e.target.value)} />
      </FormField>

      <FormField label="Address (optional)" htmlFor="register-address">
        <Textarea id="register-address" name="register-address" placeholder="Your address" rows={2}
          value={address} onChange={(e) => onAddressChange(e.target.value)} />
      </FormField>

      <FormField label={`Password ${existingUser?.password ? "(leave blank to keep current)" : "(recommended)"}`} htmlFor="register-password">
        <Input type="password" id="register-password" name="register-password"
          placeholder={existingUser?.password ? "New password" : "Set a password for your account"}
          value={password} onChange={(e) => onPasswordChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && name.trim() && (!password || password === confirmPassword)) onRegister(); }} />
      </FormField>

      {password && (
        <FormField label="Confirm Password" htmlFor="register-confirm-pw">
          <Input type="password" id="register-confirm-pw" name="register-confirm-pw" placeholder="Confirm password"
            value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && name.trim() && password === e.target.value) onRegister(); }} />
        </FormField>
      )}

      <FormField label="Security Question (optional — used to reset your password)" htmlFor="register-security-q">
        <Select id="register-security-q" name="register-security-q" className="auth-select-sm"
          value={securityQuestion} onChange={(e) => onSecurityQuestionChange(e.target.value)}>
          <option value="">Select a security question</option>
          {securityQuestions.map((q) => (<option key={q} value={q}>{q}</option>))}
          <option value="custom">✏️ Custom question...</option>
        </Select>
      </FormField>

      {securityQuestion === "custom" && (
        <FormField label="Your Custom Question" htmlFor="register-custom-q">
          <Input id="register-custom-q" name="register-custom-q" placeholder="Type your own security question"
            value={customQuestion} onChange={(e) => onCustomQuestionChange(e.target.value)} />
        </FormField>
      )}

      {securityQuestion && (
        <FormField label="Your Answer" htmlFor="register-security-a">
          <Input id="register-security-a" name="register-security-a" placeholder="Answer to your security question"
            value={securityAnswer} onChange={(e) => onSecurityAnswerChange(e.target.value)} />
        </FormField>
      )}

      <Button variant="primary" className="auth-btn-full" onClick={onRegister}
        disabled={!name.trim() || (!!password && password !== confirmPassword) || isBusy}>
        {existingUser ? "Save & Continue" : isShopOwner ? "Join as Shop Owner" : "Start Shopping"}
      </Button>

      <p className="auth-muted-text">
        <button onClick={onBackToName} className="auth-ghost-btn auth-ghost-btn--sm auth-ghost-btn--bold">← Use a different name</button>
      </p>
    </>
  );
}
