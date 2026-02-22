import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import Sidebar from "./Sidebar";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePopup, setActivePopup] = useState(null);
  const togglePopup = (popup) => {
    setActivePopup(activePopup === popup ? null : popup);
  };
  const closeAll = () => setActivePopup(null);

  const handleUrlNav = (path) => {
    navigate(path);
    closeAll();
  };

  function getUrlLast(url) {
    const last = url?.split("/").filter(Boolean).pop();
    return last
      ? last.charAt(0).toUpperCase() + last.slice(1)
      : "Business Assistant";
  }

  const pageTitle = getUrlLast(location.pathname);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <span
            className="pi pi-bars lite-icon-btn"
            onClick={() => togglePopup("sidebar")}
          ></span>
          <span className="lite-page-title">{pageTitle}</span>
        </div>
        <div className="top-bar-right">
          <span
            className="pi pi-bell lite-icon-btn"
            onClick={() => togglePopup("notif")}
          >
            <span className="lite-badge"></span>
          </span>
          <span
            className="pi pi-user lite-icon-btn"
            onClick={() => togglePopup("user")}
          ></span>
        </div>
      </div>
      <UserMenu isOpen={activePopup === "user"} handleUrlNav={handleUrlNav} />
      <Sidebar isOpen={activePopup === "sidebar"} handleUrlNav={handleUrlNav} />
      {activePopup && <div className="overlay" onClick={closeAll}></div>}
    </>
  );
};

export default Topbar;
