import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./UserProfilePage.css";
import useUserProfile from "@/hooks/auth/useUserProfile";

const UserProfilePage = () => {
  const {
    //hooks
    crTitle,
    crView,
    setCrView,
    formData,
    formDataPswrd,
    errors,
    dataList,
    //other states
    //functions
    handleChange,
    handleSaveClick,
    handleChangePaswrd,
    handleChangePswrdClick,
    handleSubmitClick,
  } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleSave = () => {
    setIsEditing(false);
    handleSaveClick();
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
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              label="Change Password"
              icon="pi pi-key"
              className="p-button-outlined p-button-secondary"
              style={{ width: '100%' }}
              onClick={handleChangePswrdClick}
            />
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

      <Dialog
        header={crTitle}
        visible={crView === "form"}
        onHide={() => setCrView("list")}
        style={{ width: "400px" }}
        modal
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setCrView("list")}
              className="p-button-text p-button-secondary"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={handleSubmitClick}
            />
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
          <div className="form-field">
            <label htmlFor="users_pswrd">Current Password</label>
            <InputText
              id="users_pswrd"
              type="password"
              className={errors.users_pswrd ? "p-invalid" : ""}
              value={formDataPswrd?.users_pswrd || ""}
              onChange={(e) => handleChangePaswrd("users_pswrd", e.target.value)}
            />
            {errors.users_pswrd && (
              <small className="p-error block">{errors.users_pswrd}</small>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="users_pswrd_new">New Password</label>
            <InputText
              id="users_pswrd_new"
              type="password"
              className={errors.users_pswrd_new ? "p-invalid" : ""}
              value={formDataPswrd?.users_pswrd_new || ""}
              onChange={(e) => handleChangePaswrd("users_pswrd_new", e.target.value)}
            />
            {errors.users_pswrd_new && (
              <small className="p-error block">{errors.users_pswrd_new}</small>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="users_pswrd_con">Confirm Password</label>
            <InputText
              id="users_pswrd_con"
              type="password"
              className={errors.users_pswrd_con ? "p-invalid" : ""}
              value={formDataPswrd?.users_pswrd_con || ""}
              onChange={(e) => handleChangePaswrd("users_pswrd_con", e.target.value)}
            />
            {errors.users_pswrd_con && (
              <small className="p-error block">{errors.users_pswrd_con}</small>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfilePage;
