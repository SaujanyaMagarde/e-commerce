import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const authstatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authstatus) {
      navigate('/login');
    }
  }, [authstatus, navigate]);

  const [details, setDetails] = useState(null);

  const getProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_GET_USER_DETAILS}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Data not fetched');
      }

      const data = await res.json();
      setDetails(data.message.user);
    } catch (error) {
      console.error('Data not fetched', error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  
  if(details == null){
    return(
      <><h1>SOMETHING WENT WRONG</h1></>
    )
  }

  return (
    <div className="profile-container">
      {details ? (
        <div className="profile-card">
          <img src={details.avatar} alt="User Avatar" className="profile-avatar" />
          <h2 className="profile-name">{details.fullname}</h2>
          <p className="profile-username">@{details.username}</p>
          <p className="profile-email">{details.email}</p>
          <p className="profile-mobile">📱 {details.mobile_no}</p>
          <p className="profile-address">🏠 {details.address}</p>
        </div>
      ) : (
        <p className="loading">Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
