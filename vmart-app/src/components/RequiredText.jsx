const RequiredText = ({ text }) => {
  return text ? (
    <small className="mb-3 text-red-500 text-sm">{text}</small>
  ) : null;
};

export default RequiredText;
