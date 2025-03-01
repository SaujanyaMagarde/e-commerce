import { Route, Routes } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar.jsx';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';
import History from '../../Components/History/History.jsx'
import './Sellhistroy.css';

function SellHistory() {
  return (
    <>
      <Navbar />
      <div className='admin-container'>
        <Sidebar />
        <History/>
      </div>
    </>
  );
}

export default SellHistory;
