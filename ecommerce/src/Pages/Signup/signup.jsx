import React, { useState } from 'react';
import './signup.css';
import {useNavigate} from "react-router-dom"
const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        mobile_no: '',
        password: '',
        address: '',
        avatar: null, // Store file object
    });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (!formData.fullname.trim()) newErrors.fullname = "Full name is required!";
        if (!/^[a-zA-Z\s]+$/.test(formData.fullname)) newErrors.fullname = "Invalid name format!";
        if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) newErrors.email = "Invalid email format!";
        if (!formData.username.trim()) newErrors.username = "Username is required!";
        if (!formData.mobile_no.match(/^\d{10}$/)) newErrors.mobile_no = "Mobile number must be 10 digits!";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters!";
        if (!formData.address.trim()) newErrors.address = "Address is required!";
        if (!formData.avatar) newErrors.avatar = "Profile picture is required!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        setLoading(true);
        setErrors({}); // Clear previous errors
    
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });
    
        try {
            const res = await fetch(`${import.meta.env.VITE_USER_REGISTER}`, {
                method: 'POST',
                body: formDataToSend,
            });
    
            if (!res.ok) {
                alert("server error please try after some time")
                throw new Error("Failed to register. Please try again.");
            }
    
            const data = await res.json();
    
            if (data.success) {
                navigate('/login');
            } else {
                setErrors({ server: data.message || "Registration failed. Try again." });
            }
        } catch (error) {
            alert("server error please try after some time")
            setErrors({ server: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { name: 'fullname', type: 'text', placeholder: 'Full Name' },
                    { name: 'email', type: 'email', placeholder: 'Email' },
                    { name: 'username', type: 'text', placeholder: 'Username' },
                    { name: 'mobile_no', type: 'tel', placeholder: 'Mobile Number' },
                    { name: 'password', type: 'password', placeholder: 'Password' },
                    { name: 'address', type: 'text', placeholder: 'Address' }
                ].map((field, index) => (
                    <div className="input-group" key={index}>
                        <p>{field.name}</p>
                        <input 
                            type={field.type} 
                            name={field.name} 
                            placeholder={field.placeholder} 
                            value={formData[field.name]} 
                            onChange={handleChange} 
                        />
                        {errors[field.name] && <span className="error">{errors[field.name]}</span>}
                    </div>
                ))}

                {/* File Input for Avatar */}
                <div className="input-group">
                    <label className="file-label">
                        Upload Profile Picture
                        <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} />
                    </label>
                    {avatarPreview && <img src={avatarPreview} alt="Profile Preview" className="avatar-preview" />}
                    {errors.avatar && <span className="error">{errors.avatar}</span>}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? <span className="loader"></span> : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Signup;
