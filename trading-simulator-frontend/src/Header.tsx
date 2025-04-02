import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import "./Header.css";
import { useAuth } from "./AuthContext";
import Logo from "./Logo"
import { MenuOpen } from "@mui/icons-material";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); 
  const { user, logout } = useAuth();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const MouseEnter = () => setMenuOpen(true)
  const MouseLeave = () => setMenuOpen(false)
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login");
    setMenuOpen(!menuOpen);
  };

  const handleLink = (page: string) => {
    if(menuOpen){
      setMenuOpen(!menuOpen);
    }
    navigate(page);
  };



  return ( 
    <header className="Header">

        <div className="Header-menu" onClick={toggleMenu}>
          <div className={`Hamburger1 ${menuOpen ? "Open" : ""}`} ></div>
          <div className={`Hamburger2 ${menuOpen ? "Open" : ""}`} ></div>
          <div className={`Hamburger3 ${menuOpen ? "Open" : ""}`} ></div>
        </div>

        <h1 className="Header-logo" onClick={() => handleLink("/")}>
            <Logo/>
        </h1>
        {user ? (
          <p className="HeaderUsername" onClick={() => handleLink("/portfolio")}>{user.username}</p>
        ) : (
            <img src="/UserIcon.png" alt="User" className="UserIcon" onClick={() => handleLink("/login")} />
        )}


      
      {menuOpen && (
        <nav className="DropdownMenu" onMouseEnter={MouseEnter} onMouseLeave={MouseLeave}>
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <div className="LineBreakers"></div>
            <li>
              <Link to="/about" onClick={toggleMenu}>
                About
              </Link>
            </li>
            <div className="LineBreakers"></div>
            <li>
              <Link to="/portfolio" onClick={toggleMenu}>
              Portfolio
              </Link>
            </li>
            {user ? (
              <>
                <div className="LineBreakers"></div>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
