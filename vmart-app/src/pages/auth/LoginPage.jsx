
import useLogin from "../../hooks/useLogin";


const LoginPage = () => {

  const {
    crTitle,
    crView,
    formData,
    errors,
    vmart,
    viewTitle,
    handleChange,
    handleSubmitLogin,
    handleChangeMobileNo,
  } = useLogin();

  return (
    <div className="app-shell app-shell--auth">
      <section className="page-section auth-page">
      <div className="auth-brand">
        <div className="auth-logo">🚀</div>
        <h1 className="auth-brand-title">Virtual Mart</h1>
        <p className="auth-brand-text">Your Trusted Store</p>
      </div>

      <div className="auth-content">
        <h3>{viewTitle.title}</h3>
        <p>{viewTitle.subTitle}</p>
        {vmart && <p>Shop No — {vmart}</p>}

        <div className="ui-form-field">
          <label className="ui-form-label" htmlFor="mobileNo">
            Mobile No
          </label>
          <input
            id="mobileNo"
            type="number"
            className="ui-input"
            placeholder="Mobile No"
            value={formData.users_id}
            onChange={(e) => handleChange("users_id", e.target.value)}
            disabled={crView !== "LOGIN"}
          />
        </div>


        {crView !== "LOGIN" && (
          <button type="button" onClick={handleChangeMobileNo} className="ui-link">
            Change Mobile No
          </button>
        )}


        <div className="ui-field-error">{errors.users_id}</div>


        {(crView === "PASSWORD" || crView === "SIGNUP") && (
          <div className="ui-form-field">
            <label className="ui-form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="ui-input"
              placeholder="Password"
            />
          </div>
        )}


        {crView === "SIGNUP" && (
          <>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="signupName">
                Your Name
              </label>
              <input
                id="signupName"
                type="text"
                className="ui-input"
                placeholder="Your Name"
              />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label" htmlFor="signupAddress">
                Your Address
              </label>
              <input
                id="signupAddress"
                type="text"
                className="ui-input"
                placeholder="Your Address"
              />
            </div>
          </>
        )}


        <button type="button" className="ui-btn ui-btn-primary" onClick={handleSubmitLogin}>
          {viewTitle.button}
        </button>


        <div className="ui-divider">
          <span>OR</span>
        </div>


        <p className="ui-auth-footer">
          Forgot password?
          <a href="#">Recover</a>
        </p>

      </div>
    </section>
    </div>
  );
};

export default LoginPage;
