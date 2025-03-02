import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import userdefault from '../../../../sample image/userdefault.png';
import { logout } from '../../ReduxStore/AuthSlice.jsx';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menu, setMenu] = useState('Shop');
  const [userImage, setUserImage] = useState(userdefault);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
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
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
    dispatch(logout());
    navigate('/');
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Close mobile menu if clicked outside and not on hamburger button
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.classList.contains('hamburger') &&
        !event.target.parentElement.classList.contains('hamburger')
      ) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Close mobile menu on window resize to desktop size
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when navigating
  const handleNavigation = (selectedMenu) => {
    setMenu(selectedMenu);
    setMobileMenuOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="nav-logo">
          <img src={logo} alt="logo" />
          <p>Shopify</p>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
          <ul>
            <li onClick={() => handleNavigation('Shop')}>
              <Link to="/">Shop</Link>
              {menu === 'Shop' ? <hr /> : null}
            </li>
            <li onClick={() => handleNavigation('Men')}>
              <Link to="/mens">Men</Link>
              {menu === 'Men' ? <hr /> : null}
            </li>
            <li onClick={() => handleNavigation('Women')}>
              <Link to="/womens">Women</Link>
              {menu === 'Women' ? <hr /> : null}
            </li>
            <li onClick={() => handleNavigation('Kids')}>
              <Link to="/kids">Kids</Link>
              {menu === 'Kids' ? <hr /> : null}
            </li>
            
            {/* Mobile-only login options */}
            <div className="mobile-user-menu">
              {auth ? (
                <>
                  <li>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  </li>
                  <li>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Order History</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </li>
              )}
            </div>
          </ul>
        </div>

        <div className="nav-login-cart">
          {/* User Image with Dropdown - Desktop */}
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

          <Link to="/cart" className="cart-icon-container">
            <img src={cart_icon} alt="Cart" />
            {cartItemCount > 0 && <div className="nav-cart-count">{cartItemCount}</div>}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;