import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useAuth } from "@/hooks/useAuth.jsx";
import { useToast } from "@/hooks/useToast.jsx";
import FingerprintIcon from "./FingerprintIcon";

const greetings = [
  "Welcome",
  "Hello there!",
  "Greetings!",
  "Good to see you!",
  "Hey there!",
  "Welcome back!",
  "Hi, Have a good day!",
  "Nice to meet you!",
  "Howdy!",
  "Happy time!",
];

const LoginComp = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [usersEmail, setUsersEmail] = useState("admin@sgd.com");
  const [usersPswrd, setUsersPswrd] = useState("password");
  const [isBusy, setIsBusy] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [fallingLetters, setFallingLetters] = useState([]);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [currentGreeting, setCurrentGreeting] = useState("Welcome");

  useEffect(() => {
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    setCurrentGreeting(randomGreeting);
  }, []);

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    // Only show inputs if not loading
    if (!isBusy) {
      // Small delay to prevent flickering
      setTimeout(() => setShowInputs(true), 150);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const deltaX = (mouseX - centerX) / (rect.width / 2);
    const deltaY = (mouseY - centerY) / (rect.height / 2);

    const skewX = deltaX * 10; // Adjust skew intensity
    const skewY = deltaY * 10;

    card.style.transform = `translateY(-5px) skew(${skewX}deg, ${skewY}deg) scale(1.15)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Only hide inputs if not loading
    if (!isBusy) {
      // Small delay before hiding to prevent flickering
      setTimeout(() => setShowInputs(false), 10000);
    }

    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = "translateY(0px) skew(0deg, 0deg) scale(1)";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      setShowInputs(false);

      const formDataBody = {
        users_email: usersEmail,
        users_pswrd: usersPswrd,
      };
      const response = await login(formDataBody);
      //console.log("Response:", response);

      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message
      );

      if (response.success) {
        navigate("/home");
      } else {
        // Trigger falling letters animation for password only if it has values
        if (usersPswrd.trim()) {
          const letters = usersPswrd.split("").map((char, index) => ({
            id: `password-${index}`,
            char: "*", // Obscure password characters for security
            type: "password",
            delay: Math.random() * 0.5,
            leftOffset: (index - (usersPswrd.length - 1) / 2) * 30, // Spread horizontally centered around 50%, 30px apart
          }));
          setFallingLetters(letters);
          // Clear letters after animation duration
          setTimeout(() => setFallingLetters([]), 5000);
          // Clear password input
          setUsersPswrd("");
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
          className={`text-center text-lg text-purple-500 mb-4 ${
            showInputs ? "visible" : "hidden"
          }`}
        >
          Version: 1.0.0
        </h2>
        <h2
          className={`text-center mb-4 pulse ${
            showInputs ? "visible" : "hidden"
          }`}
        >
          {currentGreeting}
        </h2>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <InputText
            id="usersEmail"
            value={usersEmail}
            onChange={(e) => setUsersEmail(e.target.value)}
            className="ik-inputtext wobble"
            placeholder="Enter your usersEmail"
            required
            disabled={isBusy}
          />
        </div>

        <div className={`ik-field mb-4 ${showInputs ? "visible" : "hidden"}`}>
          <Password
            id="usersPswrd"
            value={usersPswrd}
            onChange={(e) => setUsersPswrd(e.target.value)}
            className="ik-password w-full wobble"
            placeholder="Enter your password"
            feedback={false}
            required
            disabled={isBusy}
          />
          <div className="text-right mt-1">
            <label
              className="p-button-text ik-button-secondary p-0"
              onClick={() => setSearchParams({ view: "recover-password" })}
              style={{ fontSize: "0.85rem" }}
            >
              Forgot Password?
            </label>
          </div>
        </div>

        <Button
          type="submit"
          label={isBusy ? "Please wait..." : "Login"}
          icon={isBusy ? "pi pi-spin pi-spinner" : ""}
          className={`ik-button w-full wobble mb-4 ${
            showInputs || isBusy ? "visible" : "hidden"
          }`}
          loading={isBusy}
          disabled={isBusy}
        />
        <div className={`text-center ${showInputs ? "visible" : "hidden"}`}>
          <p className="text-secondary mb-2">
            Don't have an account?
            <span
              className="p-button-text ik-button-secondary w-full"
              onClick={() => setSearchParams({ view: "register" })}
            >
              Register
            </span>
          </p>
        </div>
        <div className={`text-center ${!showInputs ? "visible" : "hidden"}`}>
          <FingerprintIcon />
        </div>
      </form>
      {fallingLetters.map((letter) => (
        <span
          key={letter.id}
          className="falling-letter password"
          style={{
            animationDelay: `${letter.delay}s`,
            left: `calc(50% + ${letter.leftOffset}px)`,
            transform: "translateX(-50%)",
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  );
};

export default LoginComp;
