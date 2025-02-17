import React, { useState } from "react"; // to use state variables
import { Link, useNavigate } from "react-router-dom"; // link changes the url and updates the page
import "./Header.css";
import { useAuth } from "./AuthContext";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); // declare state variable for the state of the menu and set it to false
  const { user, logout } = useAuth();
  const toggleMenu = () => setMenuOpen(!menuOpen); // declare function to change the state of the variable
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout to clear user session
    navigate("/login"); // Redirect to login page
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
      <div className="Header-content">

        <div className="Header-menu" onClick={toggleMenu}>
          <div className="Hamburger"></div>
          <div className="Hamburger"></div>
          <div className="Hamburger"></div>
        </div>

        <h1 className="Header-logo" onClick={() => handleLink("/")}>
            <img className="Logo" src="/ProjectLogo.png" alt="Logo" />
            TradeSim
        </h1>
        {user ? (
          <p className="HeaderUsername" onClick={() => handleLink("/portfolio")}>{user.username}</p>
        ) : (
            <img src="/UserIcon.png" alt="User" className="UserIcon" onClick={() => handleLink("/login")} />
        )}

    

      </div>

      
      {menuOpen && ( // if menu is true this part will render
        <nav className="DropdownMenu">
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/portfolio" onClick={toggleMenu}>
              Portfolio
              </Link>
            </li>
            {user ? (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
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
