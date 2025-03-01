import React from 'react'
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Sidebar from '../../Components/sidebar/Sidebar.jsx'
import AddProduct from "../../Components/AddProduct/AddProduct.jsx"
import './Add.css'
function Add() {
  return (
    <>
    <Navbar/>
    <div className="addmain">
        <Sidebar/>
        <AddProduct/>
    </div>
    </>
  )
}
export default Add