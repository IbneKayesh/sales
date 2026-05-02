import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAuth } from "@/hooks/useAuth";
//import { useToast } from "@/hooks/useAppUI";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const { user } = useAuth();
  //const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.users_oname || "Admin User",
    email: user?.users_email || "admin@s1az.com",
    phone: "+1 234 567 890",
    role: user?.user_type || "Administrator",
    department: "Management",
    location: "New York, USA"
  });

  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name = "") => {
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    //toast({ severity: "success", summary: "Success", detail: "Profile updated successfully." });
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-content-grid">
        {/* Left Column: Profile Card */}
        <div className="profile-card card-professional">
          <div className="profile-card-top">
            <div className="profile-avatar-large">
              {getInitials(formData.fullName)}
            </div>
            <h2>{formData.fullName}</h2>
            <p className="role-badge">{formData.role}</p>
          </div>
          
          <div className="profile-card-details">
            <div className="detail-item">
              <i className="pi pi-envelope"></i>
              <span>{formData.email}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-phone"></i>
              <span>{formData.phone}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-map-marker"></i>
              <span>{formData.location}</span>
            </div>
            <div className="detail-item">
              <i className="pi pi-building"></i>
              <span>{formData.department}</span>
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
                value={formData.fullName} 
                onChange={(e) => handleChange("fullName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <InputText 
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <InputText 
                value={formData.phone} 
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Role</label>
              <InputText 
                value={formData.role} 
                disabled={true} // Roles typically aren't editable here
              />
            </div>
            <div className="form-field">
              <label>Department</label>
              <InputText 
                value={formData.department} 
                onChange={(e) => handleChange("department", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-field">
              <label>Location</label>
              <InputText 
                value={formData.location} 
                onChange={(e) => handleChange("location", e.target.value)}
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
