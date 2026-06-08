import profileImage from "../../../assets/profile.png";

const ProfileKit = ({ onClick }) => {
  return (
    <button
      className="task-bar-button"
      aria-label="User profile"
      onClick={onClick}
    >
      <img
        className="task-bar-button-icon"
        src={profileImage}
        alt={"user profile"}
        height="20"
        width="20"
      />
    </button>
  );
};

export default ProfileKit;
