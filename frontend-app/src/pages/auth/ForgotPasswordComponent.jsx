import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const ForgotPasswordComponent = ({ toast }) => {
  const [userEmail, setUserEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!loading) {
      setTimeout(() => setShowInputs(true), 150);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!loading) {
      setTimeout(() => setShowInputs(false), 200);
    }
    if (cardRef.current) {
      cardRef.current.style.transform =
        "translateY(0px) skew(0deg, 0deg) scale(1)";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate reset logic
    setTimeout(() => {
      toast.current.show({
        severity: "info",
        summary: "Sent",
        detail: "Default Password is 123456",
        life: 3000,
      });
      setLoading(false);
      setSearchParams({ view: "login" });
    }, 1500);
  };

  return (
    <div
      className={`login-card bubble-anim ${isHovered ? "hovered" : ""} ${
        loading ? "loading" : ""
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
          Reset Password
        </h2>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <p
            className="text-secondary mb-3 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            Enter your email.
          </p>
          <InputText
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="ik-inputtext wobble"
            placeholder="Email"
            required
            disabled={loading}
          />
        </div>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <p
            className="text-secondary mb-3 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            Enter your recovery code.
          </p>
          <InputText
            id="recoveryCode"
            value={recoveryCode}
            onChange={(e) => setRecoveryCode(e.target.value)}
            className="ik-inputtext wobble"
            placeholder="Recovery Code"
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          label={loading ? "Sending..." : "Reset Password"}
          icon={loading ? "pi pi-spin pi-spinner" : "pi pi-send"}
          className={`ik-button w-full wobble mb-4 ${
            showInputs || loading ? "visible" : "hidden"
          }`}
          loading={loading}
          disabled={loading}
        />

        <div className={`text-center ${showInputs ? "visible" : "hidden"}`}>
          <Button
            type="button"
            label="Back to Login"
            className="p-button-text ik-button-secondary w-full"
            onClick={() => setSearchParams({ view: "login" })}
          />
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

export default ForgotPasswordComponent;
