import { useState, useEffect } from "react";
import "./FormsUI.css";
import LeftbarKit from "./forms/LeftbarKit";
import TopbarKit from "./forms/TopbarKit";

const FormsUI = ({ formItem, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {}, []);

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setIsMaximized((v) => !v);
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div className={`forms-container ${isMaximized ? "is-maximized" : ""}`}>
      <TopbarKit
        onClose={() => {
          onClose(formItem);
        }}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
      />
      <LeftbarKit />
      <div className="forms-container-body">{JSON.stringify(formItem)}</div>
    </div>
  );
};
export default FormsUI;
