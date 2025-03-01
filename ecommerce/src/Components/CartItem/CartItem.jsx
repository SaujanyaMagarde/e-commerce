import React, { useEffect, useState } from "react";
import './CartItem.css'
const Cart = () => {
const [cart, setCart] = useState(null);

const fetchCart = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_GET_CART}`, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        console.log(data.message.cart);
        setCart(data.message.cart);
    } catch (error) {
        console.error(error.message);
    }
};

useEffect(() => {
    fetchCart();
}, []);

const handleAddOne = async (productID , size) => {

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
            alert("can't add item")
            throw new Error("Failed to add product to cart");
        }

        fetchCart();
    } catch (error) {
        setError(error.message || "An error occurred while adding to cart");
    }
};

// Function to handle removing one item
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
        if (!res.ok){
            alert("can't remove product an error occurs")
            throw new Error("Failed to remove item");
        }
        await fetchCart();
    } catch (error) {
        setError(error.message || "An error occurred while remove from cart");
        console.error(error.message);
    }
};


const handleCheckout = async()=>{
    try {
        const res = await fetch(`${import.meta.env.VITE_PLACE_ORDER}`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to place the order. Please try again.");
        }

        const data = await res.json();
        console.log("Order placed successfully:", data);

        alert("Order placed successfully!");
        await fetchCart();

    } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
    }
}


return (
    <div className="cart-container">
        <h2>Shopping Cart</h2>
        {cart ? (
            <>
                {cart.items.length > 0 ? (
                    <>
                        <div className="cart-items">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="cart-item">
                                    <div className="image-container">
                                        <img src={item.product.main_image} alt={item.product.name} />
                                    </div>
                                    <div>
                                        <h4>{item.product.name}</h4>
                                        <p>Price: ₹{item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                        <p>Seller: {item.seller.fullname}</p>
                                        <p>Contact: {item.seller.mobile_no}</p>
                                        <div className="quantity-controls">
                                            <button onClick={() => handleRemoveOne(item.product._id, item.size)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleAddOne(item.product._id, item.size)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-container">
                            <div className="checkout-summary">
                                <h3>Order Summary</h3>
                                <p>Total Price: ₹{cart.total_price}</p>
                            </div>
                            <button className="checkout-button" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Sorry, no items in cart.</p>
                )}
            </>
        ) : (
            <p>please add something in cart</p>
        )}
    </div>
);

};

export default Cart;
