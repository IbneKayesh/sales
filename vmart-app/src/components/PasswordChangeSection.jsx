import { FiLock, FiX, FiCheck } from "react-icons/fi";
import { useUI } from "../pages/context/UIContext";

/**
 * PasswordChangeSection – Shared component for changing/setting account password.
 * Used in both CustomerProfilePage and ShopProfilePage.
 */
export default function PasswordChangeSection({
  isOpen,
  onToggle,
  user,
  changeOldPw,
  setChangeOldPw,
  changeNewPw,
  setChangeNewPw,
  changeConfirmPw,
  setChangeConfirmPw,
  changePassword,
  prefix = "profile",
}) {
  const { showToast } = useUI();
  const p = prefix;

  if (!isOpen) {
    return (
      <div className={`${p}-pw-clickable`} onClick={onToggle}>
        <div className={`${p}-pw-clickable-icon`}><FiLock /></div>
        <div className={`${p}-pw-clickable-info`}>
          <div className={`${p}-pw-clickable-title`}>Password</div>
          <div className={`${p}-pw-clickable-desc`}>
            {user?.password ? "Change your account password" : "Set a password for your account"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${p}-pw-body`}>
      <div className={`${p}-pw-header`}>
        <div className={`${p}-avatar-icon`}>🔑</div>
        <h3 className="ui-card-title">Change Password</h3>
      </div>
      {user?.password && (
        <div className="ui-form-field">
          <label className="ui-form-label" htmlFor={`${p}-old-pw`}>Current Password</label>
          <input type="password" id={`${p}-old-pw`} name={`${p}-old-pw`} className="ui-input" placeholder="Enter current password"
            value={changeOldPw} onChange={(e) => setChangeOldPw(e.target.value)} />
        </div>
      )}
      <div className="ui-form-field">
        <label className="ui-form-label" htmlFor={`${p}-new-pw`}>New Password</label>
        <input type="password" id={`${p}-new-pw`} name={`${p}-new-pw`} className="ui-input" placeholder="Enter new password (min 4 chars)"
          value={changeNewPw} onChange={(e) => setChangeNewPw(e.target.value)} />
      </div>
      <div className="ui-form-field">
        <label className="ui-form-label" htmlFor={`${p}-confirm-pw`}>Confirm New Password</label>
        <input type="password" id={`${p}-confirm-pw`} name={`${p}-confirm-pw`} className="ui-input" placeholder="Confirm new password"
          value={changeConfirmPw} onChange={(e) => setChangeConfirmPw(e.target.value)} />
      </div>
      <div className={`${p}-pw-actions`}>
        <button className="ui-btn ui-btn-primary" onClick={async () => {
          if (!changeNewPw.trim() || changeNewPw !== changeConfirmPw) {
            showToast("Passwords do not match", "error");
            return;
          }
          if (changeNewPw.length < 4) {
            showToast("Password must be at least 4 characters", "error");
            return;
          }
          try {
            await changePassword(changeOldPw, changeNewPw);
            showToast("Password changed successfully");
            onToggle();
            setChangeOldPw("");
            setChangeNewPw("");
            setChangeConfirmPw("");
          } catch (err) {
            showToast(err.message, "error");
          }
        }} disabled={!changeNewPw.trim() || changeNewPw !== changeConfirmPw}>
          Update Password
        </button>
        <button className="ui-btn ui-btn-secondary" onClick={() => {
          onToggle();
          setChangeOldPw("");
          setChangeNewPw("");
          setChangeConfirmPw("");
        }}><FiX /> Cancel</button>
      </div>
    </div>
  );
}
