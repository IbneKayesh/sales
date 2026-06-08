import taskViewImage from "../../../assets/task-view.png";

const TaskViewKit = ({ onClick }) => {
  return (
    <button
      className="task-bar-button"
      aria-label="Task view"
      onClick={onClick}
    >
      <img
        className="task-bar-button-icon"
        src={taskViewImage}
        alt="task view"
        height="20"
        width="20"
      />
    </button>
  );
};

export default TaskViewKit;
