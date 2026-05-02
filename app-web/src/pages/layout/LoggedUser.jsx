import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { setStorageLoginData } from "@/utils/storage";
import "./LoggedUser.css";

const LoggedUser = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const op = useRef(null);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const onLogout = () => {
    logout();
  };

  const changeTheme = (theme) => {
    //console.log("theme", theme);
    setStorageLoginData({ theme: theme });

    const linkId = "erp-theme-css";
    const existingLink = document.getElementById(linkId);

    if (existingLink) {
      existingLink.href = `/themes/index-${theme}.css`;
    } else {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `/themes/index-${theme}.css`;
      document.head.appendChild(link);
    }
  };

  return (
    <>
      <div
        className="user-profile-trigger"
        onClick={(e) => op.current.toggle(e)}
      >
        <div
          className="user-avatar-small"
          aria-label={`User: ${user?.aempName || "User"}`}
        >
          {getInitials(user?.aempName)}
        </div>
        <div className="user-trigger-info">
          <span className="user-trigger-name">
            {user?.aempName?.split(" ")[0]}
          </span>
          <span className="user-trigger-role">{user?.user_type || "User"}</span>
        </div>
        <i className="pi pi-chevron-down user-trigger-chevron"></i>
      </div>

      <OverlayPanel
        ref={op}
        style={{ width: "auto", border: "none" }}
        className="light-panel shadow-8"
      >
        <div className="user-profile-card">
          <div className="user-card-header">
            <div
              className="user-card-avatar"
              aria-label={`User: ${user?.aempName || "User"}`}
            >
              {getInitials(user?.aempName)}
            </div>
            <span className="user-card-name">{user?.aempName}</span>
            <span className="user-card-email">{user?.contName}</span>
          </div>

          <div className="user-card-actions">
            <div className="theme-switcher">
              <span className="theme-label">Theme</span>

              <div className="theme-buttons">
                <button
                  title="Green"
                  className="theme-btn green"
                  onClick={() => changeTheme("green")}
                />
                <button
                  title="Blue"
                  className="theme-btn blue"
                  onClick={() => changeTheme("blue")}
                />
                <button
                  title="Red"
                  className="theme-btn red"
                  onClick={() => changeTheme("red")}
                />
                <button
                  title="Purple"
                  className="theme-btn purple"
                  onClick={() => changeTheme("purple")}
                />
                <button
                  title="Orange"
                  className="theme-btn orange"
                  onClick={() => changeTheme("orange")}
                />
                <button
                  title="Navy Blue"
                  className="theme-btn navy-blue"
                  onClick={() => changeTheme("navy-blue")}
                />
                <button
                  title="Dark"
                  className="theme-btn dark"
                  onClick={() => changeTheme("dark")}
                />
                <button
                  title="Rose"
                  className="theme-btn rose"
                  onClick={() => changeTheme("rose")}
                />
                <button
                  title="Teal"
                  className="theme-btn teal"
                  onClick={() => changeTheme("teal")}
                />
              </div>
            </div>

            <Button
              label="Profile Settings"
              icon="pi pi-user-edit"
              className="user-action-btn p-button-text"
              onClick={() => {
                op.current.hide();
                navigate("/auth/profile");
              }}
            />

            <Button
              label="Logout"
              icon="pi pi-sign-out"
              className="user-action-btn p-button-text logout"
              onClick={onLogout}
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

export default LoggedUser;
