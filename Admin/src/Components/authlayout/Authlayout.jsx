import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        if(authentication){
            if(!authStatus){
                navigate('/');
            }
        }
        setLoader(false);
    }, [authStatus, navigate, authentication]);

    // Show loader while checking authentication status
    if (loader) {
        return <h1>Loading...</h1>;
    }

    // Render children if the authentication check passes
    return <>{children}</>;
}