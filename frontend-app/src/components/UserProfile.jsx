import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ onSwitchBusiness, onLogout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const op = useRef(null);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <>
      <span
        className="topbar-btn bg-blue-500 hover:bg-blue-600 transition-colors duration-200 cursor-pointer flex align-items-center justify-content-center border-circle"
        style={{
          width: "35px",
          height: "35px",
          color: "white",
          fontWeight: "bold",
        }}
        onClick={(e) => op.current.toggle(e)}
      >
        {getInitials(user?.users_oname)}
      </span>

      <OverlayPanel ref={op} style={{ width: "250px" }} className="shadow-4">
        <div className="flex flex-column align-items-center p-3">
          <Avatar
            label={getInitials(user?.users_oname)}
            size="xlarge"
            shape="circle"
            className="bg-blue-500 text-white mb-2"
          />
          <span className="font-bold text-xl mb-1">{user?.users_oname}</span>
          <span className="text-600 text-sm mb-3">@{user?.users_users}</span>

          <div className="w-full border-top-1 border-gray-200 pt-3 flex flex-column gap-2">
            <Button
              label="Switch Business"
              icon="pi pi-briefcase"
              className="p-button-text p-button-sm justify-content-start text-gray-700"
              onClick={() => {
                op.current.hide();
                onSwitchBusiness();
              }}
            />
            <Button
              label="Profile Settings"
              icon="pi pi-user-edit"
              className="p-button-text p-button-sm justify-content-start text-gray-700"
              onClick={() => {
                op.current.hide();
                navigate("/home/auth/profile");
              }}
            />
            <Button
              label="Logout"
              icon="pi pi-sign-out"
              className="p-button-text p-button-sm p-button-danger justify-content-start"
              onClick={onLogout}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

export default UserProfile;
