import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home"; 
import Portfolio from "../Portfolio/Portfolio";
import About from "../About/About";
import Login from "../Login/Login";
import Header from "../Header/Header";
import './App.css';
import Register from "../Register/Register";
import StockDetail from "../StockDetails/StockDetail"
import Friends from "../Friends/Friends";
import UserPortfolio from "../Friends/UserPortfolio"
import { AuthProvider } from "../Functions/AuthContext";

function App() {
  return (
    <AuthProvider>
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
            <Route path="/user/:user/:username" element={<UserPortfolio/>}></Route>
          </Routes>
        </div>
    </AuthProvider>
  );
}


export default App;
