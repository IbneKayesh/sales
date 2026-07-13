import Button from "../components/Button";
import PageBar from "./PageBar";
import LoggedUser from "./LoggedUser";

const AppBar = () => {
  return (
    <div className="app-bar">
      <div className="app-bar-left">
        <Button />
      </div>
      <div className="app-bar-center">
        <PageBar />
      </div>
      <div className="app-bar-right">
        <LoggedUser/>
      </div>
    </div>
  );
};
export default AppBar;
