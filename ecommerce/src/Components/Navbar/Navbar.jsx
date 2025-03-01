import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import userdefault from '../../../../sample image/userdefault.png';
import {logout} from '../../ReduxStore/AuthSlice.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menu, setMenu] = useState('Shop');
  const [userImage, setUserImage] = useState(userdefault);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const auth = useSelector((state) => state.auth.status);
  const data = useSelector((state) => state.auth.userData);
  const cartItemCount = 1;

  useEffect(() => {
    if (auth && data?.avatar) {
      setUserImage(data.avatar);
    } else {
      setUserImage(userdefault);
    }
  }, [auth, data]);

  
  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_USER_LOGOUT}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error(`Logout failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Logout successful:', data);
      setDropdownOpen(false);

    } catch (error) {
      console.error('Error during logout:', error.message);
    }
    dispatch(logout());
    navigate('/');
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>Shopify</p>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        ☰
      </div>

      <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => setMenu('Shop')}>
            <Link to="/">Shop</Link>
            {menu === 'Shop' ? <hr /> : null}
          </li>
          <li onClick={() => setMenu('Men')}>
            <Link to="/mens">Men</Link>
            {menu === 'Men' ? <hr /> : null}
          </li>
          <li onClick={() => setMenu('Women')}>
            <Link to="/womens">Women</Link>
            {menu === 'Women' ? <hr /> : null}
          </li>
          <li onClick={() => setMenu('Kids')}>
            <Link to="/kids">Kids</Link>
            {menu === 'Kids' ? <hr /> : null}
          </li>
        </ul>

        <div className="nav-login-cart">
          {/* User Image with Dropdown */}
          <div className="user-dropdown" ref={dropdownRef}>
            <img
              src={userImage}
              alt="User"
              className="user-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                {auth ? (
                  <>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)}>Order History</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setDropdownOpen(false)}>Login</Link>
                )}
              </div>
            )}
          </div>

          <Link to="/cart">
            <img src={cart_icon} alt="Cart" />
          </Link>
          {cartItemCount > 0 && <div className="nav-cart-count">{cartItemCount}</div>}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
