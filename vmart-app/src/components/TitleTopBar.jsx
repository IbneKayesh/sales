import React from "react";
import PropTypes from "prop-types";

const TitleTopBar = ({ viewName, titleName, idValue, funcName }) => {
  if (viewName !== "viewonly" && viewName !== "form") {
    return null;
  }

  const getTitle = () => {
    if (viewName === "viewonly") return "View " + titleName;
    if (idValue) return "Edit " + titleName;
    return "New " + titleName;
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span
          className="pi pi-arrow-left lite-icon-btn"
          onClick={funcName}
          role="button"
          tabIndex={0}
        ></span>
      </div>

      <div className="top-bar-right">
        <span className="lite-page-title">
          {getTitle()}
        </span>
      </div>
    </div>
  );
};

TitleTopBar.propTypes = {
  viewName: PropTypes.string,
  titleName: PropTypes.string,
  idValue: PropTypes.any,
  funcName: PropTypes.func,
};

export default TitleTopBar;