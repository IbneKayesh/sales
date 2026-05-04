import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAuth } from "@/hooks/useAuth";
import { useAppUI } from "@/hooks/useAppUI";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useAppUI();

  const [formData, setFormData] = useState(user);

  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name = "") => {
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    showToast("error", "Update", "Profile updates are restricted." );
  };

  return (
    <div className="profile-page-container">
      {/* {JSON.stringify(user)} */}
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-content-grid">
        {/* Left Column: Profile Card */}
        <div className="profile-card card-professional">
          <div className="profile-card-top">
            <div className="profile-avatar-large">
              {getInitials(formData.users_uname)}
            </div>
            <h2>{formData.users_uname}</h2>
            <p className="role-badge">{formData.urole_rname}</p>
          </div>
          
          <div className="profile-card-details">
            <div className="detail-item">
              <i className="pi pi-envelope"></i>
              <span>{formData.users_email}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-phone"></i>
              <span>{formData.users_cntct}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-map-marker"></i>
              <span>{formData.users_emply}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-building"></i>
              <span>{formData.users_bsins}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <div className="profile-form-container card-professional">
          <div className="form-header-row">
            <h3>Personal Information</h3>
            {!isEditing ? (
              <Button 
                label="Edit Profile" 
                icon="pi pi-pencil" 
                className="p-button-outlined" 
                onClick={() => setIsEditing(true)} 
              />
            ) : (
              <div className="action-buttons">
                <Button 
                  label="Cancel" 
                  icon="pi pi-times" 
                  className="p-button-text p-button-secondary" 
                  onClick={() => setIsEditing(false)} 
                />
                <Button 
                  label="Save Changes" 
                  icon="pi pi-check" 
                  onClick={handleSave} 
                />
              </div>
            )}
          </div>

          <div className="profile-form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <InputText 
                value={formData.users_uname} 
                onChange={(e) => handleChange("users_uname", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Email/Login</label>
              <InputText 
                value={formData.users_email} 
                onChange={(e) => handleChange("users_email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Contact</label>
              <InputText 
                value={formData.users_cntct} 
                onChange={(e) => handleChange("users_cntct", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Role</label>
              <InputText 
                value={formData.urole_rname} 
                disabled={true} // Roles typically aren't editable here
              />
            </div>
            <div className="form-field">
              <label>Business</label>
              <InputText 
                value={formData.users_bsins} 
                onChange={(e) => handleChange("users_bsins", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Employee</label>
              <InputText 
                value={formData.users_emply} 
                onChange={(e) => handleChange("users_emply", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
