const EmptyState = ({ stateMessage }) => {
  return (
    <div className="flex align-items-center justify-content-center bg-gray-200 border-round p-5">
      <p className="text-gray-600">
        {stateMessage ? stateMessage : "Select a filter to view data"}
      </p>
    </div>
  );
};
export default EmptyState;
