import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import hero_img from '../Assets/hero_image.png'
import arrow_icon from '../Assets/arrow.png'
function Hero() {
  return (
    <div className='hero'>
      <div className='hero-left'>
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className='hero-hero-icon'>
            <p>NEW</p>
            <img src={hand_icon} alt="new image" />
          </div>
          <p>collection</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-btn">
          <div>Latest Colllection</div>
          <img src={arrow_icon} alt="arrow icon" />
        </div>
      </div>
      <div className='hero-right'>
        <img src={hero_img} alt="hero image" />
      </div>
    </div>
  )
}

export default Hero