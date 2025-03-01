import { useState } from "react";
import { useAuth } from "../authcontext/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      console.log("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-none p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-none hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
 