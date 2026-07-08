export default function LogRoleC({ roleName, onChangeRole }) {
  return (
    <div className="auth-role-toggle">
      <button
        onClick={() => onChangeRole("CUSTOMER")}
        className={`auth-role-btn${roleName === "CUSTOMER" ? " auth-role-btn--active" : ""}`}
      >
        👤 Customer
      </button>
      <button
        onClick={() => onChangeRole("SHOP")}
        className={`auth-role-btn${roleName === "SHOP" ? " auth-role-btn--active" : ""}`}
      >
        🏪 Shop Owner
      </button>
    </div>
  );
}
