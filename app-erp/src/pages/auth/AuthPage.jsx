import { useSearchParams } from "react-router-dom";
import LoginComp from "./LoginComp";
import RegistrationComp from "./RegistrationComp";
import RecoverPasswordComp from "./RecoverPasswordComp";
import SetPasswordComp from "./SetPasswordComp";
import "./AuthPage.css";

const AuthPage = ({ defComp }) => {
  const [searchParams] = useSearchParams();
  const component = searchParams.get("view") || defComp;

  return (
    <div className="auth-container">
      <ul className="bouncing-elements">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      <div className="flame-box">
        <div className="flame-wave -one"></div>
        <div className="flame-wave -two"></div>
        <div className="flame-wave -three"></div>
      </div>
      {component === "login" && <LoginComp />}
      {component === "register" && <RegistrationComp />}
      {component === "recover-password" && <RecoverPasswordComp />}
      {component === "set-password" && <SetPasswordComp />}
    </div>
  );
};

export default AuthPage;
