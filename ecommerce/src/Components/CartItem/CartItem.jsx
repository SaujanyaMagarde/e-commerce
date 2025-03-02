import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_GET_CART}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data.message.cart);
    } catch (error) {
      console.error(error.message);
      setError("Unable to load your cart. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAddOne = async (productID, size) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_ADDTOCART}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productID: productID,
          quantity: 1,
          size: size,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add product to cart");
      }

      fetchCart();
    } catch (error) {
      setError(error.message || "An error occurred while adding to cart");
      alert("Can't add item. Please try again.");
    }
  };

  const handleRemoveOne = async (productID, size) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REMOVEFROMCART}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productID, size }),
      });
      if (!res.ok) {
        throw new Error("Failed to remove item");
      }
      await fetchCart();
    } catch (error) {
      setError(error.message || "An error occurred while removing from cart");
      alert("Can't remove product. An error occurred.");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_PLACE_ORDER}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to place the order. Please try again.");
      }

      const data = await res.json();
      alert("Order placed successfully!");
      await fetchCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
      alert("Failed to place order. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="cart-loading">Loading your cart...</div>;
  }

  if (error) {
    return <div className="cart-error">{error}</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      {cart ? (
        <>
          {cart.items && cart.items.length > 0 ? (
            <div className="cart-content">
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="cart-item">
                    <div className="item-image-container">
                      <img 
                        src={item.product.main_image} 
                        alt={item.product.name} 
                        className="item-image"
                      />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.product.name}</h4>
                      <div className="item-info">
                        <p className="item-price">₹{item.price}</p>
                        <p className="item-size">Size: {item.size}</p>
                        <div className="item-seller">
                          <p>Seller: {item.seller.fullname}</p>
                          <p>Contact: {item.seller.mobile_no}</p>
                        </div>
                      </div>
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn decrease"
                          onClick={() => handleRemoveOne(item.product._id, item.size)}
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          className="quantity-btn increase"
                          onClick={() => handleAddOne(item.product._id, item.size)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-container">
                <div className="checkout-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{cart.total_price}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>₹{cart.total_price}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="checkout-button" 
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping">Continue Shopping</button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-cart">
          <p>Please add something to your cart</p>
          <button className="continue-shopping">Continue Shopping</button>
        </div>
      )}
    </div>
  );
};

export default Cart;