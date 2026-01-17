import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { usersAPI } from "@/api/auth/usersAPI";
import "./ProfileSettings.css";

const ProfileSettings = () => {
  const { user, business, setStorageData } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [businessData, setBusinessData] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
    if (business) {
      setBusinessData({ ...business });
    }
  }, [user, business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsBusy(true);
      const response = await usersAPI.update(formData);
      if (response.success) {
        showToast("success", "Success", "Profile updated successfully");
        // Update local storage/auth state
        setStorageData({ user: formData });
      } else {
        showToast(
          "error",
          "Error",
          response.message || "Failed to update profile"
        );
      }
    } catch (error) {
      showToast("error", "Error", error.message || "An error occurred");
    } finally {
      setIsBusy(false);
    }
  };

  if (!formData) return null;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="profile-settings-container">
      <div className="grid">
        {/* Left Column: Profile Card */}
        <div className="col-12 lg:col-4">
          <Card className="profile-sidebar-card shadow-2">
            <div className="flex flex-column align-items-center text-center">
              <Avatar
                label={getInitials(formData.users_oname)}
                size="xlarge"
                shape="circle"
                className="profile-avatar mb-3"
              />
              <h2 className="m-0 text-900">{formData.users_oname}</h2>
              <p className="text-600 mb-3">@{formData.users_users}</p>
              <div className="flex gap-2 mb-4">
                <Tag value={formData.users_drole} severity="info" />
                <Tag value={formData.users_regno} severity="warning" />
              </div>
              <Divider className="w-full" />
              <div className="w-full text-left mt-3">
                <div className="info-item mb-3">
                  <i className="pi pi-envelope mr-2 text-primary"></i>
                  <span className="text-700">{formData.users_email}</span>
                </div>
                <div className="info-item mb-3">
                  <i className="pi pi-phone mr-2 text-primary"></i>
                  <span className="text-700">{formData.users_cntct}</span>
                </div>
                <div className="info-item">
                  <i className="pi pi-briefcase mr-2 text-primary"></i>
                  <span className="text-700 font-semibold">
                    {formData.bsins_bname}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="col-12 lg:col-8">
          <Card
            className="profile-content-card shadow-2"
            title="Profile Settings"
          >
            <div className="p-fluid">
              <div className="section-title mb-4">
                <h3 className="m-0 flex align-items-center">
                  <i className="pi pi-user mr-2"></i> Personal Information
                </h3>
              </div>

              <div className="grid">
                <div className="col-12 md:col-6 field">
                  <label htmlFor="users_oname" className="font-bold">
                    Full Name
                  </label>
                  <InputText
                    id="users_oname"
                    name="users_oname"
                    value={formData.users_oname}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="col-12 md:col-6 field">
                  <label htmlFor="users_email" className="font-bold">
                    Email Address
                  </label>
                  <InputText
                    id="users_email"
                    name="users_email"
                    value={formData.users_email}
                    disabled
                    className="surface-100"
                  />
                </div>
                <div className="col-12 md:col-6 field">
                  <label htmlFor="users_cntct" className="font-bold">
                    Contact Number
                  </label>
                  <InputText
                    id="users_cntct"
                    name="users_cntct"
                    value={formData.users_cntct}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 md:col-6 field">
                  <label htmlFor="users_wctxt" className="font-bold">
                    Welcome Note
                  </label>
                  <InputText
                    id="users_wctxt"
                    name="users_wctxt"
                    value={formData.users_wctxt}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Divider className="my-5" />

              <div className="section-title mb-4">
                <h3 className="m-0 flex align-items-center">
                  <i className="pi pi-building mr-2"></i> Business Details
                </h3>
              </div>

              <div className="grid">
                <div className="col-12 md:col-6 field">
                  <label htmlFor="bsins_bname" className="font-bold">
                    Business Name
                  </label>
                  <InputText
                    id="bsins_bname"
                    value={businessData.bsins_bname}
                    disabled
                    className="surface-100"
                  />
                </div>
                <div className="col-12 md:col-6 field">
                  <label htmlFor="bsins_binno" className="font-bold">
                    BIN Number
                  </label>
                  <InputText
                    id="bsins_binno"
                    value={businessData.bsins_binno}
                    disabled
                    className="surface-100"
                  />
                </div>
                <div className="col-12 field">
                  <label htmlFor="bsins_addrs" className="font-bold">
                    Business Address
                  </label>
                  <InputText
                    id="bsins_addrs"
                    value={businessData.bsins_addrs}
                    disabled
                    className="surface-100"
                  />
                </div>
              </div>

              <div className="flex justify-content-end mt-5">
                <Button
                  label="Save Changes"
                  icon="pi pi-check"
                  className="w-auto px-5"
                  onClick={handleSave}
                  loading={isBusy}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
