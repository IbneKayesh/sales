import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useAuth } from "../../hooks/useAuth.jsx";

const RegistrationComponent = ({ toast }) => {
  const [user, setUser] = useState({
    shopName: "",
    userEmail: "",
    userPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [fallingLetters, setFallingLetters] = useState([]);
  const { register } = useAuth();  
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowInputs(false); // Hide inputs smoothly during authentication

    const result = await register(user);

    if (result.success) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Registration successful!",
        life: 3000,
      });
      navigate("/home");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: result.error,
        life: 3000,
      });
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

    setLoading(false);
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
          Create Account
        </h2>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <InputText
            name="shopName"
            value={user.shopName}
            onChange={handleInputChange}
            className="ik-inputtext wobble"
            placeholder="Shop Name"
            required
            disabled={loading}
          />
        </div>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <InputText
            name="userEmail"
            value={user.userEmail}
            onChange={handleInputChange}
            className="ik-inputtext wobble"
            placeholder="Email Address"
            required
            disabled={loading}
          />
        </div>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <Password
            name="userPassword"
            value={user.userPassword}
            onChange={handleInputChange}
            className="ik-password w-full wobble"
            placeholder="Password"
            feedback={false}
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          label={loading ? "Please wait..." : "Register"}
          icon={loading ? "pi pi-spin pi-spinner" : ""}
          className={`ik-button w-full wobble mb-4 ${
            showInputs || loading ? "visible" : "hidden"
          }`}
          loading={loading}
          disabled={loading}
        />

        <div className={`text-center ${showInputs ? "visible" : "hidden"}`}>
          <p className="text-secondary mb-2">Already have an account?</p>
          <Button
            type="button"
            label="Login"
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </div>
      </form>
    </div>
  );
};

export default RegistrationComponent;
