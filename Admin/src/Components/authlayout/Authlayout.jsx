import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {login, logout} from '../../reduxStore/AuthSlice.jsx'
export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_SELLER_INFO}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (data && data?.message?.seller?._id){
                    setLoader(false);
                } else {
                    dispatch(logout());
                    navigate('/');
                }
                } catch (err) {
                    dispatch(logout());
                    navigate('/');
                }
        };
        checkUserProfile();
    }, []);

    // Show loader while checking authentication status
    if (loader) {
        return <h1>Loading...</h1>;
    }

    // Render children if the authentication check passes
    return <>{children}</>;
}