import React, { useState, useRef, useEffect } from "react";
import { useChangePassword } from "@/hooks/setup/useChangePassword";
import ChangePasswordFormComponent from "./ChangePasswordFormComponent";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ChangePasswordPage = () => {
  const toast = useRef(null);
  const {
    isBusy,
    toastBox,
    errors,
    formData,
    handleChange,
    handleSave,
    handleClear,
  } = useChangePassword();

  useEffect(() => {
    if (toastBox && toast.current) {
      toast.current.show({
        severity: toastBox.severity,
        summary: toastBox.summary,
        detail: toastBox.detail,
        life: 3000,
      });
    }
  }, [toastBox]);

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">Change Password</h3>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Card header={getHeader()} className="bg-dark-200 border-round p-3">
        <ChangePasswordFormComponent
          isBusy={isBusy}
          errors={errors}
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
          onClear={handleClear}
        />
      </Card>
    </>
  );
};

export default ChangePasswordPage;
