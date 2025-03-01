import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import {useNavigate} from 'react-router-dom'
function AddProduct() {
  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const navigate = useNavigate();
  const [extraImages, setExtraImages] = useState(Array(5).fill(null));
  const [extraImageFiles, setExtraImageFiles] = useState(Array(5).fill(null));

  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    new_price: '',
    old_price: '',
    category: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(URL.createObjectURL(file));
      setMainImageFile(file);
    }
  };

  const handleExtraImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...extraImages];
      const newFiles = [...extraImageFiles];

      newImages[index] = URL.createObjectURL(file);
      newFiles[index] = file;

      setExtraImages(newImages);
      setExtraImageFiles(newFiles);
    }
  };

  const Add_products = async () => {
    if (!productDetails.name || !productDetails.category || !productDetails.new_price) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', productDetails.name);
    formData.append('description', productDetails.description);
    formData.append('new_price', productDetails.new_price);
    formData.append('old_price', productDetails.old_price);
    formData.append('category', productDetails.category);
    formData.append('stock', productDetails.stock);

    if (mainImageFile) {
      formData.append('main_image', mainImageFile);  // ✅ Fixed field name
    }

    extraImageFiles.forEach((file) => {
      if (file) {
        formData.append('extra_image', file);  // ✅ Fixed field name
      }
    });

    try {
      const response = await fetch('http://localhost:4000/api/v1/users/product-registeration', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to upload product');
      }

      navigate('/listproduct')

      setSuccess('Product added successfully!');
      setProductDetails({
        name: '',
        description: '',
        new_price: '',
        old_price: '',
        category: '',
        stock: '',
      });
      setMainImage(null);
      setMainImageFile(null);
      setExtraImages(Array(5).fill(null));
      setExtraImageFiles(Array(5).fill(null));
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <h2>Add New Product</h2>

      {/* Success & Error Messages */}
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Product Title */}
      <div className="addproduct-itemfield">
        <label>Product Title *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter product title"
          value={productDetails.name}
          onChange={changeHandler}
        />
      </div>

      {/* Product Description */}
      <div className="addproduct-itemfield">
        <label>Product Description</label>
        <textarea
          name="description"
          placeholder="Enter product description"
          className="addproduct-textarea"
          value={productDetails.description}
          onChange={changeHandler}
        ></textarea>
      </div>

      {/* Pricing Fields */}
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <label>Old Price</label>
          <input
            type="number"
            name="old_price"
            placeholder="Enter original price"
            value={productDetails.old_price}
            onChange={changeHandler}
          />
        </div>
        <div className="addproduct-itemfield">
          <label>New Price *</label>
          <input
            type="number"
            name="new_price"
            placeholder="Enter discounted price"
            value={productDetails.new_price}
            onChange={changeHandler}
          />
        </div>
        <div className="addproduct-itemfield">
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock"
            placeholder="Enter stock quantity"
            value={productDetails.stock}
            onChange={changeHandler}
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="addproduct-itemfield">
        <label>Product Category *</label>
        <select
          name="category"
          className="add-category"
          value={productDetails.category}
          onChange={changeHandler}
        >
          <option value="">Select Category</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      {/* Main Image Upload */}
      <div className="image-upload-container">
        <label>Main Image</label>
        <div className="image-preview">
          <img src={mainImage || upload_area} alt="Upload Preview" />
        </div>
        <input type="file" accept="image/*" name="main_image" onChange={handleMainImage} /> 
      </div>

      {/* Extra Images Upload */}
      <div className="extra-images">
        {extraImages.map((image, index) => (
          <div key={index} className="image-upload-container">
            <label>Extra Image {index + 1}</label>
            <div className="image-preview">
              <img src={image || upload_area} alt="Upload Preview" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleExtraImageChange(e, index)}
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={Add_products}
        className="submitbtn"
        disabled={loading || !productDetails.name || !productDetails.category || !productDetails.new_price}
      >
        {loading ? 'Adding Product...' : 'Add Product'}
      </button>
    </div>
  );
}

export default AddProduct;
