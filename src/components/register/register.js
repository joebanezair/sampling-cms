// src/pages/Register.js
import { useState } from "react";
import { useAuth } from "../authcontext/authContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // setError("");
  //   // setSuccess("");
  //   try {
  //     await register(email, password);
  //     setSuccess("Registration successful! Redirecting...");
  //     setTimeout(() => navigate("/dashboard"), 2000);
  //   } catch (error) {
  //     console.error("Registration failed:", error);
  //     setError(error.message || "Failed to create an account.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess(""); 
    try {
      await register(email, password);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Registration failed:", error);
  
      // Handle "email already in use" error
      if (error.code === "auth/email-already-in-use") {
        setError("Account already exists. Please log in.");
      } else {
        setError(error.message || "Failed to create an account.");
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-none p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 mb-3">
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
            className="w-full px-4 py-2 bg-green-500 text-white rounded-none hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
