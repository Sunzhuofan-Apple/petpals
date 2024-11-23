import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header({ username, isLogin, handleLogin }) {
  const [showMenu, setShowMenu] = useState(false); 
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    setShowMenu(false); 
  };

  return (
    <header className="AppHeader">
      <div
        className="header-button username"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {username}
        {showMenu && (
          <div className="dropdown-menu">
            <button onClick={() => navigateTo('/MyProfile')}>Profile</button>
            <button onClick={() => navigateTo('/Friends')}>Friends</button>
          </div>
        )}
      </div>
      <button className="header-button" onClick={handleLogin}>
        {isLogin ? "Logout" : "Login"}
      </button>
    </header>
  );
}

Header.propTypes = {
  username: PropTypes.string,
  isLogin: PropTypes.bool.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default Header;
