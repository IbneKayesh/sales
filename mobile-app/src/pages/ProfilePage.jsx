import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Trophy,
  ShoppingBag,
  Users,
  Save,
  Lock,
  ChevronRight,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    bio: "Senior Sales Administrator with 8+ years of experience in retail management.",
    role: "Administrator",
  });

  return (
    <div className="app-container">
      {/* Header */}
      <div
        className="page-header"
        style={{ background: "var(--primary)", color: "#fff", border: "none" }}
      >
        <button
          className="back-btn"
          onClick={() => navigate("/")}
          style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
        >
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">My Profile</span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            marginLeft: "auto",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            padding: "8px",
            borderRadius: "10px",
          }}
        >
          {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
        </button>
      </div>

      {/* Profile Info Hero */}
      <div
        style={{
          background: "var(--primary)",
          padding: "0 20px 40px",
          textAlign: "center",
          color: "#fff",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100px",
            height: "100px",
            margin: "0 auto 16px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "35px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 800,
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            JD
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              background: "#22C55E",
              padding: "4px",
              borderRadius: "50%",
              border: "3px solid var(--primary)",
            }}
          >
            <CheckCircle size={16} color="#fff" />
          </div>
        </div>
        <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 900 }}>
          {profile.name}
        </h2>
        <span
          style={{
            fontSize: "12px",
            opacity: 0.8,
            background: "rgba(0,0,0,0.1)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontWeight: 700,
          }}
        >
          {profile.role}
        </span>
      </div>

      <div style={{ padding: "16px", marginTop: "-20px" }}>
        {/* Stats Row */}
        <div
          className="card"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            textAlign: "center",
            padding: "16px",
          }}
        >
          <div>
            <div style={{ color: "var(--primary)", marginBottom: "4px" }}>
              <Trophy size={18} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800 }}>$1.2M</div>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              Sales
            </div>
          </div>
          <div
            style={{
              borderLeft: "1px solid var(--border)",
              borderRight: "1px solid var(--border)",
            }}
          >
            <div style={{ color: "#7C3AED", marginBottom: "4px" }}>
              <ShoppingBag size={18} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800 }}>850</div>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              Orders
            </div>
          </div>
          <div>
            <div style={{ color: "#F97316", marginBottom: "4px" }}>
              <Users size={18} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800 }}>124</div>
            <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              Clients
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="card" style={{ marginTop: "16px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "14px", fontWeight: 800 }}>
            Personal Information
          </h3>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Mail size={14} /> Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            ) : (
              <div
                style={{
                  padding: "10px",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--on-surface)",
                  fontWeight: 600,
                }}
              >
                {profile.email}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Phone size={14} /> Phone Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            ) : (
              <div
                style={{
                  padding: "10px",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--on-surface)",
                  fontWeight: 600,
                }}
              >
                {profile.phone}
              </div>
            )}
          </div>

          <div className="form-group">
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <MapPin size={14} /> Professional Bio
            </label>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--on-surface)",
                  fontSize: "14px",
                }}
              />
            ) : (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: "var(--text-secondary)",
                }}
              >
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="card" style={{ marginTop: "16px", padding: "0" }}>
          <div
            onClick={() => navigate("/profile/change-password")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--background)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                }}
              >
                <Lock size={18} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--on-surface)",
                  }}
                >
                  Security
                </div>
                <div
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  Change account password
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--border)" />
          </div>
        </div>

        <div
          className="card"
          style={{
            marginTop: "16px",
            marginBottom: "40px",
            padding: "16px",
            borderLeft: "4px solid #22C55E",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{ fontSize: "14px", fontWeight: 800, color: "#22C55E" }}
              >
                Verified Professional
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  marginTop: "2px",
                }}
              >
                Trusted seller since 2021
              </div>
            </div>
            <CheckCircle size={24} color="#22C55E" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
