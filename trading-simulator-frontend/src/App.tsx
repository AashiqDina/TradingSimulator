import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // to determine what is rendered depending on the url
import Home from "./Home"; // paths to pages files
import Portfolio from "./Portfolio";
import About from "./About";
import Login from "./Login";
import Header from "./Header";
import './App.css';
import Register from "./Register";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    // below path is the for the url while element determines what is shown
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;