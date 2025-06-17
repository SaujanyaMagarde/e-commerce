import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./reduxStore/AuthSlice.jsx";
import Admin from "./Pages/Admin/Admin.jsx";
import LoginPage from "./Pages/loginPage/LoginPage.jsx";
import Signup from "./Pages/SignupPage/Signup.jsx";
import HomePage from "./Pages/HomePage/HomePage.jsx"
import Protected from "./Components/authlayout/Authlayout.jsx"
import Add from "./Pages/AddproductPage/Add.jsx"
import List from "./Pages/ListProductPage/List.jsx"
import SellHistory from "./Pages/SellHistory/Sellhistory.jsx"
import './index.css';

function App() {
  const dispatch = useDispatch();

  const checkAuthStatus = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SELLER_INFO, {
        method: "GET",
        credentials: "include", 
      });

      const data = await res.json();
      if (data && data?.message?.seller?._id) {
        dispatch(login({ userData: data.message}));
      } else {
        dispatch(logout());
      }
    } catch (err) {
      dispatch(logout());
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);
  

  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/login' element={<Protected authentication={false}><LoginPage/></Protected>} />
      <Route path='/signup' element={<Protected authentication={false}><Signup/></Protected>} />
      <Route path='/dashboard' element={<Protected authentication={true}><Admin/></Protected>} />
      <Route path='/addproduct' element={<Protected authentication={true}><Add/></Protected>}/>
      <Route path='/listproduct' element={<Protected authentication={true}><List/></Protected>}/>
      <Route path='/history' element={<Protected authentication={true}><SellHistory/></Protected>}/>
    </Routes>
    </>
  );
}

export default App;
