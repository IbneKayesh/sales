import { PrimeIcons } from "primereact/api";

const EmptyState = ({ stateMessage }) => {
  return (
    <div
      className="flex flex-column align-items-center justify-content-center border-round p-6 text-center"
      style={{ backgroundColor: "var(--hover-bg)" }}
    >
      <i
        className={`${PrimeIcons.INBOX} text-4xl mb-3`}
        style={{ color: "var(--primary)" }}
      />

      <p className="text-lg m-0" style={{ color: "var(--text-muted)" }}>
        {stateMessage || "No records found"}
      </p>
    </div>
  );
};

export default EmptyState;