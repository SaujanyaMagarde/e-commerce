import React from 'react'
import './HomePage.css'
import {Link} from 'react-router-dom'
function HomePage() {
  return (
    <div className="seller-home">
    <header className="header">
      <h1>Welcome to <span>Shopify by SAUJANYA</span></h1>
      <p>The perfect platform to grow your business online!</p>
    </header>

    <section className="benefits">
      <h2>Why Sell on Shopify?</h2>
      <div className="benefits-list">
        <div className="benefit-card">
          <h3>🚀 Reach Millions</h3>
          <p>Expand your customer base across India and beyond.</p>
        </div>
        <div className="benefit-card">
          <h3>📈 Easy to Use</h3>
          <p>Manage products, track sales, and process orders effortlessly.</p>
        </div>
        <div className="benefit-card">
          <h3>💰 Secure Payments</h3>
          <p>Get paid securely and on time without hassle.</p>
        </div>
        <div className="benefit-card">
          <h3>📦 Hassle-Free Logistics</h3>
          <p>Seamless shipping and delivery support to simplify your business.</p>
        </div>
      </div>
    </section>

    <section className="cta">
      <h2>Ready to Start Selling?</h2>
      <p>Create your seller account today and take your business online!</p>
      <div className="buttons">
        <Link to="/signup" className="btn signup-btn">Sign Up</Link>
        <Link to="/login" className="btn login-btn">Login</Link>
      </div>
    </section>

    <footer className="footer">
      <p>Need help? <a href="#">Contact Seller Support</a></p>
    </footer>
  </div>
  )
}

export default HomePage