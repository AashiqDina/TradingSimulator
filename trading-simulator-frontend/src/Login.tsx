import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {user, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, navigate to the dashboard
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the user info (including id) in the AuthContext
        login({
          id: data.user.id,
          username: data.user.username,
          investedAmount: data.user.investedAmount,
          currentValue: data.user.currentValue,
          profitLoss: data.user.profitLoss,
        });

        console.log("Login successful");
        navigate("/portfolio"); // Redirect after successful login
      } else {
        setError(data.message);
      }
    } catch (error) {
      const errStr = `${error}`
      setError(errStr);
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
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="UsernameInput"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="PasswordInput"
            required
          />
        </div>
        <button className="SubmitButton" type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Don't have an account?</p>
      <a href="/register">Register</a>
    </div>
  );
};

export default Login;
