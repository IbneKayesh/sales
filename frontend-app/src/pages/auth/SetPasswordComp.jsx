import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useToast } from "@/hooks/useToast.jsx";
import { useAuth } from "@/hooks/useAuth.jsx";

const SetPasswordComp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState({
    usersEmail: "",
    usersPswrd: "",
    usersRecky: "",
  });
  const [isBusy, setIsBusy] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { setPassword } = useAuth();
  const { showToast } = useToast();
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isBusy) {
      setTimeout(() => setShowInputs(true), 150);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    card.style.transform = `translateY(-5px) skew(${deltaX * 10}deg, ${
      deltaY * 10
    }deg) scale(1.15)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isBusy) {
      setTimeout(() => setShowInputs(false), 30000);
    }
    if (cardRef.current) {
      cardRef.current.style.transform =
        "translateY(0px) skew(0deg, 0deg) scale(1)";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //console.log(user);
      //console.log(searchParams.get("recoverykey"));
      if (!user.usersEmail || !user.usersPswrd || !user.usersRecky) {
        showToast("error", "Error", "Please fill all fields");
        return;
      }
      setIsBusy(true);
      //setShowInputs(false);
      const formDataBody = {
        ...user,
        id: searchParams.get("recoverykey"),
      };
      const response = await setPassword(formDataBody);
      //console.log(response);
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message
      );

      if (response.success) {
        setSearchParams({ view: "login" });
      }
    } catch (error) {      
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div
      className={`login-card bubble-anim ${isHovered ? "hovered" : ""} ${
        isBusy ? "loading" : ""
      }`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <form onSubmit={handleSubmit}>
        <h2
          className={`text-center mb-4 pulse ${
            showInputs ? "visible" : "hidden"
          }`}
        >
          Set Your Password
        </h2>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <InputText
            name="usersEmail"
            value={user.usersEmail}
            onChange={handleInputChange}
            className="ik-inputtext wobble"
            placeholder="Enter your email"
            required
            disabled={isBusy}
          />
        </div>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <Password
            name="usersPswrd"
            value={user.usersPswrd}
            onChange={handleInputChange}
            className="ik-password w-full wobble"
            placeholder="Enter new password"
            feedback={false}
            required
            disabled={isBusy}
          />
        </div>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <InputText
            name="usersRecky"
            value={user.usersRecky}
            onChange={handleInputChange}
            className="ik-inputtext wobble"
            placeholder="Enter new recovery key"
            required
            disabled={isBusy}
          />
        </div>

        <Button
          type="submit"
          label={isBusy ? "Please wait..." : "Recover Password"}
          icon={isBusy ? "pi pi-spin pi-spinner" : ""}
          className={`ik-button w-full wobble mb-4 ${
            showInputs || isBusy ? "visible" : "hidden"
          }`}
          loading={isBusy}
          disabled={isBusy}
        />

        <div className={`text-center ${showInputs ? "visible" : "hidden"}`}>
          <p>
            Back to
            <span
              className="p-button-text ik-button-secondary w-full"
              onClick={() => setSearchParams({ view: "login" })}
            >
              Login
            </span>
          </p>
        </div>

        <div className={`text-center ${!showInputs ? "visible" : "hidden"}`}>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="48"
            height="48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z" />
          </svg>
        </div>
      </form>
    </div>
  );
};

export default SetPasswordComp;
