import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { setStorageLoginData } from "@/utils/storage";
import "./LoggedUser.css";

const LoggedUser = () => {
  const { emply, logout, business } = useAuth();
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
          aria-label={`User: ${emply?.emply_cname || "User"}`}
        >
          {getInitials(emply?.emply_cname)}
        </div>
        <div className="user-trigger-info">
          <span className="user-trigger-name">
            {emply?.emply_cname?.split(" ")[0]}
          </span>
          <span className="user-trigger-role">{emply?.emply_urole || "User"}</span>
        </div>
        <i className="pi pi-chevron-down user-trigger-chevron"></i>
      </div>

      <OverlayPanel
        ref={op}
        style={{ width: "auto", border: "none" }}
        className="light-panel shadow-8"
      >
        {/* {JSON.stringify(user)} */}
        <div className="user-profile-card">
          <div className="user-card-header">
            <div
              className="user-card-avatar"
              aria-label={`User: ${emply?.emply_cname || "User"}`}
            >
              {getInitials(emply?.emply_cname)}
            </div>
            <span className="user-card-name">{emply?.emply_cname}</span>
            <span className="user-card-email">{emply?.emply_email}</span>
            <span className="user-card-email">{emply?.emply_urole}</span>
            <span className="user-card-email">{business?.bsins_bname}</span>
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
                <button
                  title="Indigo"
                  className="theme-btn indigo"
                  onClick={() => changeTheme("indigo")}
                />
                <button
                  title="Emerald"
                  className="theme-btn emerald"
                  onClick={() => changeTheme("emerald")}
                />
                <button
                  title="Amber"
                  className="theme-btn amber"
                  onClick={() => changeTheme("amber")}
                />
                <button
                  title="Cyan"
                  className="theme-btn cyan"
                  onClick={() => changeTheme("cyan")}
                />
                <button
                  title="Pink"
                  className="theme-btn pink"
                  onClick={() => changeTheme("pink")}
                />
                <button
                  title="Violet"
                  className="theme-btn violet"
                  onClick={() => changeTheme("violet")}
                />
                <button
                  title="Lime"
                  className="theme-btn lime"
                  onClick={() => changeTheme("lime")}
                />
                <button
                  title="Sky"
                  className="theme-btn sky"
                  onClick={() => changeTheme("sky")}
                />
                <button
                  title="Slate"
                  className="theme-btn slate"
                  onClick={() => changeTheme("slate")}
                />
                <button
                  title="Yellow"
                  className="theme-btn yellow"
                  onClick={() => changeTheme("yellow")}
                />
                <button
                  title="Fuchsia"
                  className="theme-btn fuchsia"
                  onClick={() => changeTheme("fuchsia")}
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
