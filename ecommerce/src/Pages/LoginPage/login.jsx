import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {useSelector,useDispatch} from 'react-redux'
import {login,logout} from '../../ReduxStore/AuthSlice.jsx'
import {Link} from 'react-router-dom'
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format!";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_USER_LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        alert("server error please try after sometime")
        throw new Error("Invalid email or password!");
      }

      const data = await res.json();
      console.log(data.message);
      if (data.success) {
        dispatch(login(data.message.user));
        navigate("/"); // Redirect user on success
      } else {
        setServerError(data.message || "Login failed! Try again.");
      }
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {serverError && <p className="server-error">{serverError}</p>}

          <button type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : "Login"}
          </button>
        </form>
        <p>new here ? <Link to="/signup">register here</Link> </p>
      </div>
    </div>
  );
};

export default Login;
