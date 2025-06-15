import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../ReduxStore/AuthSlice.jsx';
import { useNavigate } from 'react-router-dom';
import {searchProduct} from '../../ReduxStore/AuthSlice.jsx';
function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menu, setMenu] = useState('Shop');
  const [userImage, setUserImage] = useState('/sample_image/userdefault.png');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const auth = useSelector((state) => state.auth.status);
  const data = useSelector((state) => state.auth.userData);
  const cartItemCount = useSelector((state) => state.auth.cartItemCount);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (auth && data?.avatar) {
      setUserImage(data.avatar);
    } else {
      setUserImage('/sample_image/userdefault.png');
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

  const handleSearch = async (query) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_GET_ALL_PRODUCT}?search=${query}&page=1&limit=32`, 
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        );

        const data = await response.json();
        setProducts(data.message.products);
        console.log("Search results:", data.message.products);
        dispatch(searchProduct(data.message.products));
        navigate('/searchedProducts')
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
};


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-logo">
          <img src={logo} alt="logo" />
          <p>Shopify</p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e.target.value);
              }
            }}
          />
        </div>

        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
          <ul>
            <li><Link to="/">Shop</Link></li>
            <li><Link to="/mens">Men</Link></li>
            <li><Link to="/womens">Women</Link></li>
            <li><Link to="/kids">Kids</Link></li>
          </ul>
        </div>

        <div className="nav-login-cart">
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
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">Order History</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <Link to="/login">Login</Link>
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
    </nav>
  );
}

export default Navbar;
