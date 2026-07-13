import "./Button.css";

const Button = () => {
  return (
    <button class="apps-button" aria-label="Apps">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="5" cy="5" r="1.5" />
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="19" cy="5" r="1.5" />

        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />

        <circle cx="5" cy="19" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
        <circle cx="19" cy="19" r="1.5" />
      </svg>
    </button>
  );
};
export default Button;
