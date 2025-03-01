import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";
import navlogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';
import {logout} from '../../reduxStore/AuthSlice.jsx'
import {useDispatch} from 'react-redux'


function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Correct way to use navigation
  const dispatch = useDispatch(); 

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    alert("Logging out...");
  
    try {
      const res = await fetch(`${import.meta.env.VITE_LOGOUT}`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!res.ok) {
        throw new Error('Logout failed');
      }
  
      console.log("Logout successful");
      dispatch(logout()); // Dispatch logout action
      
      navigate('/login'); 
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };
  

  return (
    <div className='navbar'>
      <img src={navlogo} alt='Logo' className='nav-logo' />

      <div className='nav-profile-container'>
        <img 
          src={navProfile} 
          alt='Profile' 
          className='nav-profile' 
          onClick={toggleDropdown} 
        />

        {dropdownOpen && (
          <div className='dropdown-menu'>
            <ul>
              <li onClick={() => navigate('/dashboard')}>Dashboard</li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
