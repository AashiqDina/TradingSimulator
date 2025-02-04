import React, { useState } from "react"; // to use state variables
import { Link } from "react-router-dom"; // link changes the url and updates the page
import "./Header.css";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); // declare state variable for the state of the menu and set it to false

  const toggleMenu = () => setMenuOpen(!menuOpen); // declare function to change the state of the variable

  return ( 
    <header className="Header">
      <div className="Header-content">

        <div className="Header-menu" onClick={toggleMenu}>
          <div className="Hamburger"></div>
          <div className="Hamburger"></div>
          <div className="Hamburger"></div>
        </div>

        <h1 className="Header-logo">
          <Link to="/"><img className="Logo" src="/ProjectLogo.png" alt="Logo" />TradeSim</Link>
        </h1>

        <Link to="/login" className="Header-user">
          <img src="/UserIcon.png" alt="User" className="UserIcon" />
        </Link>

    

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
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
