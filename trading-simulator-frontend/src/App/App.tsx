import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Home/Home"; 
import Portfolio from "../Portfolio/Portfolio";
import About from "../About/About";
import Login from "../Login/Login";
import Header from "../Header/Header";
import './App.css';
import Register from "../Register/Register";
import StockDetail from "../StockDetails/StockDetail"
import Friends from "../Friends/Friends";
import { AuthProvider } from "../Functions/AuthContext";

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
            <Route path="/friends" element={<Friends />}> </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;