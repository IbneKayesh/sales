import { Link } from "react-router-dom";

const NotFoundComp = () => {
    return (
    <div className="app-container">
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "48px 24px",
          maxWidth: "500px",
          margin: "40px auto",
        }}
      >
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>😕</div>

        <h1
          style={{
            fontSize: "64px",
            margin: 0,
            color: "var(--primary)",
          }}
        >
          404
        </h1>

        <h3
          style={{
            color: "var(--on-surface)",
            margin: "12px 0 8px",
          }}
        >
          Page Not Found
        </h3>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "var(--primary)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: 600,
            transition: "0.2s ease",
          }}
        >
          ↩ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundComp;
