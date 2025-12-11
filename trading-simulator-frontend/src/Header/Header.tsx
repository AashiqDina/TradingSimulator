import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import "./Header.css";
import { useAuth} from "../Functions/AuthContext";
import Logo from "../Logo/Logo"

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); 
  const { user, logout } = useAuth();
  const toggleMenu = () => setMenuOpen(!menuOpen);
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

        <button tabIndex={0} aria-label="Open Menu" aria-expanded={menuOpen ? "true" : "false"} className={`Header-menu ${menuOpen ? "Open" : ""}`} onClick={toggleMenu}>
          <div className={`Hamburger1 ${menuOpen ? "Open" : ""}`} ></div>
          <div className={`Hamburger2 ${menuOpen ? "Open" : ""}`} ></div>
          <div className={`Hamburger3 ${menuOpen ? "Open" : ""}`} ></div>
        </button>

        <nav aria-label="Menu" className="DropdownMenu" onMouseLeave={MouseLeave} style={!menuOpen ? {zIndex: -10000, opacity: 0, borderRadius: '0 7rem 7rem 0', pointerEvents: "none"}: {zIndex: 100000, opacity: 1}}>
          <ul>
            <li>
             <button aria-label="Home Page" tabIndex={menuOpen ? 0 : -1} onClick={() => {toggleMenu(); navigate("/");}}>
                Home
              </button>
            </li>
            <li>
              <button aria-label="About Page" tabIndex={menuOpen ? 0 : -1} onClick={() => {toggleMenu(); navigate("/about");}}>
                About
              </button>
            </li>
            {user ? (
              <li>
                <button aria-label="Friends Page" tabIndex={menuOpen ? 0 : -1} onClick={() => {toggleMenu(); navigate("/friends");}}>
                Friends
                </button>
            </li>
            ) : <></>}
            {user ? (
              <li>
                <button aria-label="Portfolio Page" tabIndex={menuOpen ? 0 : -1} onClick={() => {toggleMenu(); navigate("/portfolio");}}>
                Portfolio
                </button>
            </li>
            ) : <></>}
            {user ? (
              <>
                <li>
                  <button aria-label="Logout Button" className="LogoutButton" tabIndex={menuOpen ? 0 : -1} onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <></>
            )}
            {!user ? (
              <li style={{marginTop: "0.5rem"}}>
                <button aria-label="Login Button" role="button" onClick={() => {toggleMenu(); navigate("/login");}} tabIndex={menuOpen ? 0 : -1} className="LogoutButton" style={{fontSize: "1.1rem"}}>Login</button>
              </li>
            ) : <></>}
          </ul>
        </nav>

        <button aria-label="Home Page" className="Header-logo" onClick={() => handleLink("/")}>
            <Logo/>
        </button>
        {user ? (
          <button role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLink("/portfolio")}} aria-label="Click here to visit your portfolio" className="HeaderUsername" onClick={() => handleLink("/portfolio")}>{user.username}</button>
        ) : (
            <button aria-label="Login Button" className="Header-logo" onClick={() => handleLink("/login")} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLink("/login")}}><img src="/UserIcon.png" alt="Icon for a user that is not logged in" className="UserIcon" /></button>
        )}
      
        
    </header>
  );
};

export default Header;
