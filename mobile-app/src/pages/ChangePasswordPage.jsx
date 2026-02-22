import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* Back Row */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Change Password</span>
      </div>

      <div className="card">
        {/* Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "rgba(15,118,110,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <Lock size={24} color="var(--primary)" />
        </div>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "13px",
            marginBottom: "20px",
            lineHeight: 1.5,
          }}
        >
          Your new password must be at least 8 characters and include a mix of
          letters and numbers.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/profile");
          }}
        >
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "16px" }}
          >
            Update Password
          </button>

          <button
            type="button"
            className="btn-primary btn-secondary"
            onClick={() => navigate(-1)}
            style={{ marginTop: "8px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
