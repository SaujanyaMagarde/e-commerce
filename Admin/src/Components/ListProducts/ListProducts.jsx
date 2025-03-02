import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListProduct.css";

function ListProducts() {
  const [allproducts, setAllproducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInfo = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      let res = await fetch(`${import.meta.env.VITE_ALL_PRODUCT}`, {
        method: "POST",
        credentials: "include",
      });

      let data = await res.json();

      if (!res.ok) {
        if (data.message === "jwt expired") {
          try {
            let resp = await fetch(`${import.meta.env.VITE_REFRESHTOKEN}`, {
              method: "POST",
              credentials: "include",
            });

            if (!resp.ok) {
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
            
            if (!res.ok) {
              throw new Error(data.message || "Failed to fetch products");
            }
          } catch (refreshError) {
            throw new Error("Authentication failed. Please login again.");
          }
        } else {
          throw new Error(data.message || "Unknown error occurred");
        }
      }

      setAllproducts(data.message.products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
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

        // Show success message
        const successElement = document.createElement('div');
        successElement.className = 'success-toast';
        successElement.textContent = `${name} removed successfully`;
        document.body.appendChild(successElement);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
          successElement.remove();
        }, 3000);

        fetchInfo(); // Refresh product list after deletion
      } catch (error) {
        console.error("Error removing product:", error.message);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="list-product">
      <h1>All Listed Products</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          <div className="list-product-header">
            <div className="product-col">Product</div>
            <div className="title-col">Title</div>
            <div className="price-col">Old Price</div>
            <div className="price-col">New Price</div>
            <div className="category-col">Category</div>
            <div className="stock-col">Stock</div>
            <div className="action-col">Action</div>
          </div>

          <div className="list-product-container">
            {allproducts.length === 0 ? (
              <div className="no-products">
                <i className="empty-icon">📦</i>
                <p>No products available.</p>
              </div>
            ) : (
              allproducts.map((product, index) => (
                <div key={index} className="list-product-item">
                  <div className="product-col">
                    <img src={product.main_image} alt={product.name} className="product-image" />
                  </div>
                  <div className="title-col">{product.name}</div>
                  <div className="price-col">${product.old_price}</div>
                  <div className="price-col price-new">${product.new_price}</div>
                  <div className="category-col">
                    <span className="category-badge">{product.category}</span>
                  </div>
                  <div className="stock-col">
                    <span className={`stock-indicator ${parseInt(product.stock) < 10 ? 'low-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </div>
                  <div className="action-col">
                    <button 
                      className="remove-button" 
                      onClick={() => remove_product(product._id, product.name)}
                      aria-label={`Remove ${product.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ListProducts;