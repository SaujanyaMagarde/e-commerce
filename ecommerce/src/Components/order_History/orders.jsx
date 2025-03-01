import React, { useEffect, useState } from 'react';
import './orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const userOrder = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_ORDER_HISTORY}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Failed to fetch order history.');
            }

            const data = await res.json();
            if (data.message.orders.length === 0) {
                setError('No orders found.');
            } else {
                setOrders(data.message.orders);
                setError(null);
            }
        } catch (error) {
            console.error('Error fetching order history:', error);
            setError('Could not fetch order history. Please try again.');
        }
    };

    useEffect(() => {
        userOrder();
    }, []);

    return (
        <div className="orders-container">
            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            ) : orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="orderdetails">
                        <h3>Order ID: {order._id}</h3>
                        <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                        <p>Status: {order.status}</p>
                        <p>Payment Status: {order.payment_status}</p>
                        <p>Total Price: ${order.total_price}</p>
                        </div>
                        <div className="products-list">
                            {order.products.map((product, index) => (
                                <div key={index} className="product-item">
                                    <img src={product.image} alt={product.name} />
                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <p>Size : {product.size}</p>
                                        <p>Price: ${product.price}</p>
                                        <p>Quantity: {product.quantity}</p>
                                        <p>Seller: {product.seller.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="loading-message">Loading orders...</p>
            )}
        </div>
    );
}

export default Orders;
