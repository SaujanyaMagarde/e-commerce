import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import {login} from "../../reduxStore/AuthSlice.jsx"
import {useDispatch} from 'react-redux'
const Signup = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    mobile_no: '',
    aadhaar_no: '',
    shop_address: '',
    avatar: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('fullname', formData.fullname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('mobile_no', formData.mobile_no);
    formDataToSend.append('aadhaar_no', formData.aadhaar_no);
    formDataToSend.append('shop_address', formData.shop_address);
    if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SELLER_REGISTER}`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();
      console.log('Response:', data);
      dispatch(login({userData : data}))
      navigate('/dashboard')
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Your Seller Account</h2>
        <p>Join <span>Shopify by SAUJANYA</span> and start selling today!</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              name="fullname" 
              placeholder="Full Name" 
              value={formData.fullname} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="tel" 
              name="mobile_no" 
              placeholder="Mobile Number" 
              value={formData.mobile_no} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="text" 
              name="aadhaar_no" 
              placeholder="Aadhaar Number" 
              value={formData.aadhaar_no} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <textarea 
              name="shop_address" 
              placeholder="Shop Address" 
              value={formData.shop_address} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group file-input">
            <label>Upload Avatar:</label>
            <input 
              type="file" 
              name="avatar" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>

          {formData.avatar && (
            <div className="avatar-preview">
              <img src={URL.createObjectURL(formData.avatar)} alt="Avatar Preview" />
            </div>
          )}

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <p className="login-link">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Signup;
