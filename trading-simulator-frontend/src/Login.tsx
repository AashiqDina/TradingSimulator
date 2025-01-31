import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // creates state variables for the username and password
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // so that we can redirect the user if successful

  const handleLogin = (e: React.FormEvent) => { // when the form is completed and Login is clicked...
    e.preventDefault(); // prevent blank login
    
    
    if (username === "user" && password === "password") { // if the updated state variables are equal to the values...
      localStorage.setItem("isAuthenticated", "true"); // create local variable on the client side as seen and sets it to true
      navigate("/portfolio"); // navigates to the portfolio page
    } else {
      alert("Invalid credentials"); 
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