import { Route, Routes } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar.jsx';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';
import Profile from '../../Components/Profile/Profile.jsx';
import './Admin.css';

function Admin() {
  return (
    <>
      <Navbar />
      <div className='admin-container'>
        <Sidebar />
        <Profile/>
      </div>
    </>
  );
}

export default Admin;
