import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [seller, setSeller] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const getSellerInfo = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_SELLER_INFO}`, {
                method: "GET",
                credentials: "include",
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            setSeller(data.message.seller);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getSellerInfo();
    }, []);
    
    return (
        <div className="profile-container">
            <h2>Seller Profile</h2>
            {loading ? (
                <p className="loading">Loading seller details...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="profile-card">
                    <img src={seller.avatar} alt="Seller Avatar" className="profile-avatar" />
                    <h3>{seller.fullname}</h3>
                    <p><strong>Email:</strong> {seller.email}</p>
                    <p><strong>Mobile No:</strong> {seller.mobile_no}</p>
                    <p><strong>Aadhaar No:</strong> {seller.aadhaar_no}</p>
                    <p><strong>Shop Address:</strong> {seller.shop_address}</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
