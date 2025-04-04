import React from "react";
import { useSelector } from "react-redux";
import Item from "../Item/Item.jsx";
import './Related.css';
function Related() {
  const reqProduct = useSelector((state) => state.auth.reqProduct); // Get products from Redux store

  return (
    <div className="related-container">
      <div className="product-grid">
        {reqProduct.length === 0 ? (
          <p>No related products found.</p>
        ) : (
          reqProduct.map((item,i) => {
            return <Item key={i} id={item._id} name={item.name} main_image={item.main_image} new_price={item.new_price} old_price={item.old_price} />
        })
        )}
      </div>
    </div>
  );
}

export default Related;
