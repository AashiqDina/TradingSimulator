import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // creates state variables for the username and password
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // so that we can redirect the user if successful

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5048/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to another page or update the UI to show success
        console.log("Login successful");
        navigate("/portfolio")
      } else {
        // Handle login failure
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const ToRegister = () => {
    navigate("/Register");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // updates username state variable
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // updates password state variable
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account?</p>
      <a href="/register">Register</a>
    </div>
  );
};

export default Login;