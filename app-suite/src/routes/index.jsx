import { Route } from "react-router-dom";
import mainRoutes from "./mainRoutes";
import M01Routes from "./M01Routes";
import M04Routes from "./M04Routes";
import M05Routes from "./M05Routes";
import M06Routes from "./M06Routes";
import M08Routes from "./M08Routes";
import ProtectedRoute from "./ProtectedRoute";

// Routes that don't require authentication
const publicPaths = new Set(["/auth/login", "*"]);

const routes = [
  ...mainRoutes,
  ...M01Routes,
  ...M04Routes,
  ...M05Routes,
  ...M06Routes,
  ...M08Routes,
];

export default function getRoutes() {
  return routes.map(({ path, element }) => {
    const wrapped = publicPaths.has(path) ? element : <ProtectedRoute>{element}</ProtectedRoute>;
    return <Route key={path} path={path} element={wrapped} />;
  });
}
