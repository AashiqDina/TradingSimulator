import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home"; 
import Portfolio from "./Portfolio";
import About from "./About";
import Login from "./Login";
import Header from "./Header";
import './App.css';
import Register from "./Register";
import StockDetail from "./StockDetail"
import { AuthProvider } from "./AuthContext";

function App() {
  return (
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
            <Route path="/stock/:symbol" element={<StockDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;