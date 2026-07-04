import "./shared.css";

const PageHeader = ({ title, subtitle, action }) => (
  <div className="ui-page-header">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <h2 className="ui-page-title">{title}</h2>
        {subtitle && <p className="ui-page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  </div>
);

export default PageHeader;
