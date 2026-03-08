import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;