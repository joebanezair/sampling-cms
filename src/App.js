import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./components/authcontext/authContext";
import Login from "./components/login/Login";
import Register from "./components/register/register";
import Dashboard from "./components/dashboard/Dashboard";
import UserProfile from "./components/user_data_components/user_profile";

const PrivateRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />; // Corrected redirection
};

const PublicRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route path="/register" element={<PublicRoute element={<Register />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;