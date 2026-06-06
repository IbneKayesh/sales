import React from "react";

const EmptyCardsState = ({ title, text, icon, children }) => {
  return (
    <div className="empty-cards-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {text && <p className="empty-state-text">{text}</p>}
      {children}
    </div>
  );
};

export default EmptyCardsState;
