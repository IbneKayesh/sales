import './PageLoader.css';
const PageLoader = () => {
  return (
    <div className="container">
      <div className="spinner">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>
      <p className="text">Loading...</p>
    </div>
  );
};

export default PageLoader;
