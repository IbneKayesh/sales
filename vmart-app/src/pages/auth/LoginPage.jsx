import "./LoginPage.css";
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
    <div className="login-page-container">
      <div className="login-page-brand">
        <div className="logo">🚀</div>
        <h1>Virtual Mart</h1>
        <p>Your Trusted Store</p>
      </div>
      <div className="login-page-body">
        <h3>{viewTitle.title}</h3>
        <p>{viewTitle.subTitle}</p>
        <p>{vmart && "Shop No — " + vmart}</p>
        <input
          type="number"
          placeholder="Mobile No"
          value={formData.users_id}
          onChange={(e) => handleChange("users_id", e.target.value)}
          disabled={crView !== "LOGIN"}
        />
        {crView !== "LOGIN" && <span onClick={handleChangeMobileNo}>Change Mobile No</span>}
        <span className="error-text">{errors.users_id}</span>
        {(crView === "PASSWORD" || crView === "SIGNUP") && (
          <input type="password" placeholder="Password" />
        )}

        {crView === "SIGNUP" && (
          <>
            <input type="text" placeholder="Your Name" />
            <input type="text" placeholder="Your Address" />
          </>
        )}

        <button type="button" onClick={handleSubmitLogin}>
          {viewTitle.button}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <p className="signup">
          Forgot password?
          <a href="#"> Recover</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
