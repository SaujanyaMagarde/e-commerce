import React from 'react'
import Navbar from '../../Components/Navbar/Navbar.jsx'
import Sidebar from '../../Components/sidebar/Sidebar.jsx'
import ListProducts from "../../Components/ListProducts/ListProducts.jsx"
import './List.css'
function List() {
  return (
    <>
    <Navbar/>
    <div className="listmain">
      <Sidebar/>
      <ListProducts/>
    </div>
    </>
  )
}
export default List