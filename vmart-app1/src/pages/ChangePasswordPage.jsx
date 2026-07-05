import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.next.length < 6) {
      showToast("warn", "Too short", "Password must be at least 6 characters");
      return;
    }
    if (form.next !== form.confirm) {
      showToast("warn", "Mismatch", "New passwords do not match");
      return;
    }
    setLoading(true);
    const result = await changePassword({ currentPassword: form.current, newPassword: form.next });
    setLoading(false);
    if (result.success) {
      showToast("success", "Updated", result.message);
      navigate("/profile");
    } else {
      showToast("error", "Failed", result.message);
    }
  };

  return (
    <div className="page-container" style={{ padding: "12px" }}>
      <h2 style={{ marginBottom: "12px" }}>Change Password</h2>
      <form onSubmit={handleSubmit} className="card" style={{ padding: "12px" }}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
