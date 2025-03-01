import { Navigate } from "react-router-dom";
import { useAuth } from "../authcontext/authContext";

const PrivateRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
