import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

  }, [error]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const checkResponse = await fetch("http://localhost:3000/api/User/checkUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      console.log("Check Response Status:", checkResponse.status);
      const checkResponseText = await checkResponse.text();
      console.log("Check Response Text:", checkResponseText);
  
      if (!checkResponse.ok) {
        throw new Error("Error checking username availability");
      }
  
      const checkData = JSON.parse(checkResponseText);
      if (checkData.exists) {
        setError("Username already taken. Please choose another one.");
        return;
      }
  
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
      console.log("Response Text:", responseText);
  
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
    <section className={`register-container ${(error && (error != "")) ? "error" : ""}`}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
      <label htmlFor="username" className="SrOnly">Username</label>
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
        <label htmlFor="password" className="SrOnly">Password</label>
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
        <label htmlFor="confirmPassword" className="SrOnly">Confirm Password</label>
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

        {error && <p role="alert" className="RegisterError">{error}</p>}

        <button className="SubmitButton" type="submit">Register</button>
      </form>
      <p className="noAccount">
        Already have an account?
      </p>
      <a className="noAccountRegister" aria-label="Go to login page" href="/login">Login here</a>
    </section>
  );
}

export default Register;
