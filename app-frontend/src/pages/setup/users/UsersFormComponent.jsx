import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import t_users from "@/models/setup/t_users.json";

const UsersFormComponent = ({ isBusy, errors, formData, onChange, onSave }) => {
  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "User", value: "User" },
  ];

  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="username"
            className="block text-900 font-medium mb-2"
          >
            {t_users.t_users.username.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="username"
            value={formData.username}
            onChange={(e) => onChange("username", e.target.value)}
            className={`w-full ${errors.username ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_users.t_users.username.name}`}
          />
          {errors.username && (
            <small className="mb-3 text-red-500">{errors.username}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="email"
            className="block text-900 font-medium mb-2"
          >
            {t_users.t_users.email.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`w-full ${errors.email ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_users.t_users.email.name}`}
          />
          {errors.email && (
            <small className="mb-3 text-red-500">{errors.email}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="password"
            className="block text-900 font-medium mb-2"
          >
            {t_users.t_users.password.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            className={`w-full ${errors.password ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_users.t_users.password.name}`}
          />
          {errors.password && (
            <small className="mb-3 text-red-500">{errors.password}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="role"
            className="block text-900 font-medium mb-2"
          >
            {t_users.t_users.role.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="role"
            value={formData.role}
            options={roleOptions}
            onChange={(e) => onChange("role", e.value)}
            className={`w-full ${errors.role ? "p-invalid" : ""}`}
            placeholder={`Select ${t_users.t_users.role.name}`}
          />
          {errors.role && (
            <small className="mb-3 text-red-500">{errors.role}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.user_id ? "Update" : "Save"}
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              severity="success"
              loading={isBusy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersFormComponent;
