import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import "./Header.css";
import { useAuth } from "./AuthContext";
import Logo from "./Logo"

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
    <header id="Top" className="Header">

        <div  role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleMenu(); }} aria-label="Click to open Menu" aria-expanded={menuOpen ? "true" : "false"} className="Header-menu" onClick={toggleMenu}>
          <div className={`Hamburger1 ${menuOpen ? "Open" : ""}`} ></div>
          <div className={`Hamburger2 ${menuOpen ? "Open" : ""}`} ></div>
          <div className={`Hamburger3 ${menuOpen ? "Open" : ""}`} ></div>
        </div>

        <h1 role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLink("/")}} className="Header-logo" onClick={() => handleLink("/")}>
            <Logo/>
        </h1>
        {user ? (
          <p role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLink("/portfolio")}} aria-label="Click here to visit your portfolio" className="HeaderUsername" onClick={() => handleLink("/portfolio")}>{user.username}</p>
        ) : (
            <img role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLink("/login")}} src="/UserIcon.png" alt="Icon for a user that is not logged in" className="UserIcon" onClick={() => handleLink("/login")} />
        )}


      
      {menuOpen && (
        <nav aria-label="Menu" className="DropdownMenu" onMouseEnter={MouseEnter} onMouseLeave={MouseLeave}>
          <ul>
            <li>
              <Link role="button" to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link role="button" to="/about" onClick={toggleMenu}>
                About
              </Link>
            </li>
            <li>
              <Link role="button" to="/portfolio" onClick={toggleMenu}>
              Portfolio
              </Link>
            </li>
            {user ? (
              <>
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
