import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      // Check if the username already exists
      const checkResponse = await fetch("http://localhost:3000/api/User/checkUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
  
      // Log the response status and text
      console.log("Check Response Status:", checkResponse.status);
      const checkResponseText = await checkResponse.text();
      console.log("Check Response Text:", checkResponseText);
  
      // Check if the response is successful
      if (!checkResponse.ok) {
        throw new Error("Error checking username availability");
      }
  
      const checkData = JSON.parse(checkResponseText);
      if (checkData.exists) {
        setError("Username already taken. Please choose another one.");
        return; // Stop further execution if username is taken
      }
  
      // If username is available, proceed with registration
      const response = await fetch("http://localhost:3000/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      const responseText = await response.text();
      console.log("Response Text:", responseText); // Log the response
  
      let data;
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        throw new Error("Empty response from server");
      }
  
      if (data.success) {
        console.log("Register successful");
        navigate("/");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration process:", error);
      const errStr = `${error}`
      setError(errStr);
    }
  };
  
  

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="UsernameInput"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="PasswordInput"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="ConfirmPasswordInput"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="SubmitButton" type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Register;
