import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Shop from './Pages/Shop.jsx'
import ShopCategory from './Pages/ShopCategory'
import Product from './Pages/Product'
import Footer from './Components/Footer/Footer.jsx'
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import Signup from './Pages/Signup/signup.jsx'
import Login from './Pages/LoginPage/login.jsx'
import Profile from './Components/Profile/Profile.jsx'
import Cartuse from "./Pages/CartPage/Cart.jsx"
import Orders from "./Components/order_History/orders.jsx"
import Protected from "./Components/AuthLayout/AuthLayout.jsx"
import Related from './Components/Related/Related.jsx'
import Success from './Pages/Success.jsx'
function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Shop/>} />
        <Route path="/mens" element={<ShopCategory banner={men_banner} category="men"/>} />
        <Route path="/womens" element={<ShopCategory banner={women_banner} category="women"/>} />
        <Route path="/kids" element={<ShopCategory banner={kid_banner}  category="kids"/>} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/profile' element={<Protected authentication={true}><Profile/></Protected>} />
        <Route path='/cart' element={<Protected authentication={true}><Cartuse/></Protected>} />
        <Route path='/orders' element={<Protected authentication={true}><Orders/></Protected>}/>
        <Route path='/success' element={<Protected authentication={true}><Success/></Protected>} />
        <Route path='/searchedProducts' element={<Related/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App

