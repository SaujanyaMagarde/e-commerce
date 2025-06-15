import React, { useState, useEffect } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";

function ProductDisplay({ product }) {
    const [heroimage, setheroimage] = useState(product.main_image);
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setheroimage(product.main_image);
    }, [product]);

    const handelimage = (img) => {
        setheroimage(img);
    };

    const handleSizeSelection = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Please select a size before adding to cart!");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_ADDTOCART}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productID: product._id,
                    quantity: 1,
                    size: selectedSize,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to add product to cart");
            }

            const data = await res.json();
            console.log(data);
            alert("Product added to cart!");
        } catch (error) {
            setError(error.message || "An error occurred while adding to cart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    {product.extra_image?.map((img, index) => (
                        <img key={index} onClick={() => handelimage(img)} src={img} alt='Product' />
                    ))}
                    <img onClick={() => handelimage(product.main_image)} src={product.main_image} alt='Product' />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={heroimage} alt='Product' />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    {[...Array(4)].map((_, i) => (
                        <img key={i} src={star_icon} alt="Star" />
                    ))}
                    <img src={star_dull_icon} alt="Star" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        ${product.old_price}
                    </div>
                    <div className="productdisplay-right-price-new">
                        ${product.new_price}
                    </div>
                </div>
                <div className='productdisplay-right-description'>
                    <p>{product.description}</p>
                </div>
                <div className='productdisplay-right-size'>
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-size-options">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                            <div
                                key={size}
                                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => handleSizeSelection(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleAddToCart} className='productdisplay-cart' disabled={loading}>
                    {loading ? <span className="loader"></span> : 'ADD TO CART'}
                </button>
                {error && <p className="error-message">{error}</p>}
                <p className='productdisplay-right-category'>
                    <span>Category: </span>{product.category}
                </p>
                <p className='productdisplay-right-category'>
                    <span>TAGS: </span>Modern, Latest
                </p>
            </div>
        </div>
    );
}

export default ProductDisplay;
