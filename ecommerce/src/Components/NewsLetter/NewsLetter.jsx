import React from 'react'
import './NewsLetter.css'
function NewsLetter() {
  return (
    <div className="newsletter">
        <h1>Get Exclusive oferr on your E-mail</h1>
        <p>Subscribe to our newsletter and get exclusive offer offer on your mail</p>
        <div>
            <input type='email' placeholder='Your Email Id' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter