const EmptyState = ({ stateMessage }) => {
  return (
    <div className="empty-state">
      <span className="pi pi-search empty-state-icon" />
      <span className="empty-state-text">
        {stateMessage ? stateMessage : "No data found"}
      </span>
    </div>
  );
};
export default EmptyState;
