import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useAuth } from "@/hooks/useAuth.jsx";
import { useToast } from "@/hooks/useToast.jsx";

const RegistrationComp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState({
    bsinsBname: "My Shop BD",
    usersEmail: "admin@sgd.com",
    usersPswrd: "password",
    usersRecky: "recover",
    usersOname: "Admin",
  });
  const [isBusy, setIsBusy] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [fallingLetters, setFallingLetters] = useState([]);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
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
      setIsBusy(true);
      setShowInputs(false);
      const response = await register(user);
      //console.log(response);
      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message
      );

      if (response.success) {
        navigate("/login");
      } else {
        // Trigger falling letters animation for password only if it has values
        if (user.userPassword.trim()) {
          const letters = user.userPassword.split("").map((char, index) => ({
            id: `password-${index}`,
            char: "*", // Obscure password characters for security
            type: "password",
            delay: Math.random() * 0.5,
            leftOffset: (index - (user.userPassword.length - 1) / 2) * 30, // Spread horizontally centered around 50%, 30px apart
          }));
          setFallingLetters(letters);
          // Clear letters after animation duration
          setTimeout(() => setFallingLetters([]), 5000);
          // Clear password input
          setUser({
            ...user,
            userPassword: "",
          });
        }
        // Show inputs again after failed login
        setTimeout(() => setShowInputs(true), 500);
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
          Create Account
        </h2>
        <p
          className={`text-center mb-4 pulse ${
            showInputs ? "visible" : "hidden"
          }`}
        >
          Start your online journey
        </p>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <InputText
            name="bsinsBname"
            value={user.bsinsBname}
            onChange={handleInputChange}
            className="ik-inputtext wobble"
            placeholder="Enter your business name"
            required
            disabled={isBusy}
          />
        </div>

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
            placeholder="Enter your password"
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
            placeholder="Enter your recovery key"
            required
            disabled={isBusy}
          />
        </div>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <InputText
            name="usersOname"
            value={user.usersOname}
            onChange={handleInputChange}
            className="ik-inputtext wobble"
            placeholder="Enter your name"
            required
            disabled={isBusy}
          />
        </div>

        <Button
          type="submit"
          label={isBusy ? "Please wait..." : "Register"}
          icon={isBusy ? "pi pi-spin pi-spinner" : ""}
          className={`ik-button w-full wobble mb-4 ${
            showInputs || isBusy ? "visible" : "hidden"
          }`}
          loading={isBusy}
          disabled={isBusy}
        />

        <div className={`text-center ${showInputs ? "visible" : "hidden"}`}>
          <p className="text-secondary mb-2">
            Already have an account?
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </div>
      </form>
    </div>
  );
};

export default RegistrationComp;
