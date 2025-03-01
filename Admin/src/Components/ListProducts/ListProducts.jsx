import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListProduct.css";

function ListProducts() {
  const [allproducts, setAllproducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Store errors
  const navigate = useNavigate();

  const fetchInfo = async () => {
    try {
      setErrorMessage(""); // Reset error before fetching

      let res = await fetch(`${import.meta.env.VITE_ALL_PRODUCT}`, {
        method: "POST",
        credentials: "include",
      });

      let data = await res.json(); // Parse response

      if (!res.ok) {
        if (data.message === "jwt expired") {
          console.warn("JWT expired, refreshing token...");

          let resp = await fetch(`${import.meta.env.VITE_REFRESHTOKEN}`, {
            method: "POST",
            credentials: "include",
          });

          if (!resp.ok) {
            console.error("Token refresh failed. Redirecting to login...");
            setErrorMessage("Session expired. Please log in again.");
            navigate("/login");
            return;
          }

          // Retry fetching products after refreshing token
          res = await fetch(`${import.meta.env.VITE_ALL_PRODUCT}`, {
            method: "POST",
            credentials: "include",
          });

          data = await res.json();
        } else {
          throw new Error(data.message || "Unknown error occurred");
        }
      }

      setAllproducts(data.message.products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setErrorMessage(error.message); // Set error message in state
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    try {
         
      setErrorMessage("");

      let res = await fetch(`${import.meta.env.VITE_REMOVE_PRODUCT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.json();
        throw new Error(errorText.message || "Failed to remove product");
      }

      fetchInfo(); // Refresh product list after deletion
    } catch (error) {
      console.error("Error removing product:", error.message);
      setErrorMessage(error.message); // Display error on frontend
    }
  };

  return (
    <div className="list-product">
      <h1>All Listed Products</h1>

      {/* Display error message if it exists */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="list-product-header">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Stock</p>
        <p>Remove</p>
      </div>

      <div className="list-product-container">
        {allproducts.length === 0 ? (
          <p className="no-products">No products available.</p>
        ) : (
          allproducts.map((pro, index) => (
            <div key={index} className="list-product-item">
              <img src={pro.main_image} alt={pro.name} className="product-image" />
              <p>{pro.name}</p>
              <p>${pro.old_price}</p>
              <p>${pro.new_price}</p>
              <p>{pro.category}</p>
              <p>{pro.stock}</p>
              <div className="remove-icon" onClick={() => remove_product(pro._id)}>
                ❌
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListProducts;
