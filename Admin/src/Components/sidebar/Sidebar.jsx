import React from 'react'
import "./Sidebar.css"
import {Link} from "react-router-dom"
import add_product_icon from "../../assets/Product_Cart.svg"
import listproduct_icon from "../../assets/Product_list_icon.svg"
function Sidebar() {
  return (
    <div className='sidebar'>
        <Link to = {'/addproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={add_product_icon} alt='' />
            <p>Add Product</p>
        </div>
        </Link>
        <Link to = {'/listproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={listproduct_icon} alt='' />
            <p>Product List</p>
        </div>
        </Link>
        <Link to = {'/history'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={listproduct_icon} alt='' />
            <p>HISTORY</p>
        </div>
        </Link>
    </div>
  )
}

export default Sidebar