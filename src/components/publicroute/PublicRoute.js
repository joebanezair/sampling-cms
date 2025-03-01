import { Navigate } from "react-router-dom";
import { useAuth } from "../authcontext/authContext";

const PublicRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : element;
};

export default PublicRoute;
