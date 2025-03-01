import { useEffect, useState } from "react";
import "./History.css"; // Import CSS file

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SELL_HISTORY}`, {
          method: "POST",
          credentials: "include", // Needed for authentication cookies
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data.message.sells);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="history-container">
      <h2 className="history-title">Seller Order History</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Image</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price/Unit ($)</th>
                <th>Total Price ($)</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Buyer</th>
                <th>Buyer Email</th>
                <th>Buyer Address</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.product_name}</td>
                  <td>
                    <img
                      src={order.product_image}
                      alt={order.product_name}
                      className="product-image"
                    />
                  </td>
                  <td>{order.required_size}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price_per_unit}</td>
                  <td>{order.total_price}</td>
                  <td>{order.status}</td>
                  <td>{order.payment_status}</td>
                  <td>{order.buyer_name}</td>
                  <td>{order.buyer_email}</td>
                  <td>{order.buyer_address}</td>
                  <td>
                    {new Date(order.order_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;