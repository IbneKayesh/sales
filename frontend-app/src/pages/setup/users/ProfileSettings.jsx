import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/datetime";
import { Button } from "primereact/button";
import PasswordComp from "./PasswordComp";

const ProfileSettings = () => {
  const { user, business } = useAuth();
  const [formData, setFormData] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    if (user) setFormData({ ...user });
    if (business) setBusinessData({ ...business });
  }, [user, business]);

  if (!formData || !businessData) return null;

  const activePlan = formData.users_stats;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const plans = {
    0: { title: "Starter", subtitle: "Full features • No payment" },
    1: { title: "Professional", subtitle: "Full features • Online support" },
    2: { title: "Enterprise", subtitle: "Full features • Advanced support" },
  };

  const features = [
    { name: "Full Features", s: true, p: true, e: true },
    { name: "Pay As You Go", s: true, p: true, e: true },
    { name: "Community Support", s: true, p: true, e: true },
    { name: "Online Support", s: false, p: true, e: true },
    { name: "Activity Report", s: false, p: true, e: true },
    { name: "Forecast Report", s: false, p: false, e: true },
    { name: "Custom Report", s: false, p: false, e: true },
  ];

  const renderIcon = (value) =>
    value ? (
      <i className="pi pi-check text-green-500 text-xs"></i>
    ) : (
      <i className="pi pi-times text-red-500 text-xs"></i>
    );

  return (
    <div className="grid">
      {/* Left Side: Profile Card & Plan */}
      <div className="col-12 lg:col-4 px-3">
        <Card className="shadow-3 border-round-2xl surface-card">
          <div className="flex flex-column align-items-center text-center">
            <div className="p-1 bg-white border-circle inline-flex shadow-2 mt-2">
              <Avatar
                label={getInitials(formData.users_oname)}
                size="xlarge"
                shape="circle"
                className="bg-primary text-white border-3 border-white w-8rem h-8rem text-4xl"
              />
            </div>

            <h2 className="text-900 font-bold text-3xl mt-4 mb-1">
              {formData.users_oname}
            </h2>

            <p className="text-500 font-semibold mb-4">
              {formData.users_isrgs ? "Primary" : "Secondary"}
            </p>

            <div className="flex gap-2 mb-4 justify-content-center">
              <Tag value={formData.users_drole} severity="info" rounded />
              <Tag value={formData.users_regno} severity="warning" rounded />
            </div>

            {/* Profile Info Summary */}
            <div className="w-full text-left mt-3">
              {[
                {
                  icon: "pi-envelope",
                  label: "Email Address",
                  value: formData.users_email,
                },
                {
                  icon: "pi-phone",
                  label: "Contact",
                  value: formData.users_cntct,
                },
                {
                  icon: "pi-shield",
                  label: "Current Plan",
                  value: (
                    <div className="flex align-items-center gap-2">
                      <span className="text-primary font-bold">
                        {plans[formData.users_stats]?.title}
                      </span>
                      <span className="text-xs text-400">
                        ({plans[formData.users_stats]?.subtitle.split("•")[0]})
                      </span>
                    </div>
                  ),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex align-items-center p-3 border-round-xl mb-2 hover:surface-hover transition-colors transition-duration-150"
                >
                  <div className="flex align-items-center justify-content-center bg-blue-50 text-blue-600 border-round-lg w-3rem h-3rem mr-3">
                    <i className={`pi ${item.icon} text-lg`}></i>
                  </div>

                  <div className="flex flex-column">
                    <span className="text-xs text-500 font-bold mb-1 uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="text-800 font-semibold">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Divider className="my-5" />

          {/* Plan Membership Comparison */}
          <div className="bg-gray-50 border-round-xl p-4 border-1 border-gray-100">
            <div className="text-xs text-500 uppercase font-bold mb-4">
              Membership Details
            </div>

            {/* Headers */}
            <div className="grid text-center font-bold mb-3 border-bottom-1 border-200 pb-2">
              <div className="col-5 text-left text-xs text-600">FEATURES</div>
              <div
                className={`col-2 text-xs ${activePlan === 0 ? "text-primary font-bold" : "text-400"}`}
              >
                Starter
              </div>
              <div
                className={`col-3 text-xs ${activePlan === 1 ? "text-primary font-bold" : "text-400"}`}
              >
                Professional
              </div>
              <div
                className={`col-2 text-xs ${activePlan === 2 ? "text-primary font-bold" : "text-400"}`}
              >
                Enterprise
              </div>
            </div>

            {features.map((feat, idx) => (
              <div
                key={idx}
                className="grid align-items-center py-2 border-bottom-1 border-50 last:border-none"
              >
                <div className="col-5 text-xs font-bold text-700">
                  {feat.name}
                </div>
                <div
                  className={`col-2 ${activePlan === 0 ? "bg-blue-50 border-round" : ""}`}
                >
                  {renderIcon(feat.s)}
                </div>
                <div
                  className={`col-3 ${activePlan === 1 ? "bg-blue-50 border-round" : ""}`}
                >
                  {renderIcon(feat.p)}
                </div>
                <div
                  className={`col-2 ${activePlan === 2 ? "bg-blue-50 border-round" : ""}`}
                >
                  {renderIcon(feat.e)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Side: Personal & Business Info */}
      <div className="col-12 lg:col-8 px-3">
        <Card
          className="shadow-3 border-round-2xl surface-card h-full"
          title={
            <span className="text-3xl font-bold text-900 px-2">
              Profile Information
            </span>
          }
        >
          <div className="p-fluid px-2">
            {[
              {
                title: "Contact",
                icon: "pi-user-edit",
                fields: [
                  {
                    id: "users_oname",
                    label: "Full Name",
                    value: formData.users_oname,
                  },
                  {
                    id: "users_email",
                    label: "Email Address",
                    value: formData.users_email,
                  },
                  {
                    id: "users_cntct",
                    label: "Contact Number",
                    value: formData.users_cntct,
                  },
                  {
                    id: "users_wctxt",
                    label: "Welcome Note",
                    value: formData.users_wctxt,
                  },
                ],
              },
              {
                title: "Business",
                icon: "pi-briefcase",
                fields: [
                  {
                    id: "bsins_bname",
                    label: "Business Name",
                    value: businessData.bsins_bname,
                    full: true,
                  },
                  {
                    id: "bsins_email",
                    label: "Business Email",
                    value: businessData.bsins_email,
                  },
                  {
                    id: "bsins_cntct",
                    label: "Contact",
                    value: businessData.bsins_cntct,
                  },
                  {
                    id: "bsins_binno",
                    label: "BIN",
                    value: businessData.bsins_binno,
                  },
                  {
                    id: "bsins_btags",
                    label: "Tags",
                    value: businessData.bsins_btags,
                  },
                  {
                    id: "bsins_bstyp",
                    label: "Type",
                    value: businessData.bsins_bstyp,
                  },
                  {
                    id: "bsins_stdat",
                    label: "Opening Date",
                    value: formatDate(businessData.bsins_stdat),
                  },
                  {
                    id: "bsins_addrs",
                    label: "Address",
                    value: businessData.bsins_addrs,
                    md: 8,
                  },
                  {
                    id: "bsins_cntry",
                    label: "Country",
                    value: businessData.bsins_cntry,
                    md: 4,
                  },
                ],
              },
            ].map((section, sIdx) => (
              <div key={sIdx} className={sIdx > 0 ? "mt-6" : ""}>
                <div className="flex align-items-center mb-4 pb-2 border-bottom-1 border-200">
                  <div className="bg-primary-50 text-primary-600 border-round-lg p-2 mr-3 flex align-items-center justify-content-center">
                    <i className={`pi ${section.icon} text-lg`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-800 m-0">
                    {section.title}
                  </h3>
                </div>

                <div className="grid">
                  {section.fields.map((field, fIdx) => (
                    <div
                      key={fIdx}
                      className={`col-12 ${field.full ? "" : `md:col-${field.md || 6}`} mb-3`}
                    >
                      <label className="block mb-2 text-600 font-semibold text-sm">
                        {field.label}
                      </label>

                      <InputText
                        value={field.value || ""}
                        readOnly
                        className="surface-50 border-1 border-200 border-round-lg p-3 text-800"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-content-end">
            <Button
              label="Change Password"
              icon="pi pi-key"
              className="p-button-rounded"
              onClick={() => setShowPasswordDialog(true)}
            />
          </div>
        </Card>
      </div>

      <PasswordComp
        visible={showPasswordDialog}
        setVisible={setShowPasswordDialog}
      />
    </div>
  );
};

export default ProfileSettings;
