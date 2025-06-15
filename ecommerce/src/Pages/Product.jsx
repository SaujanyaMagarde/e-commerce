import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrum/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DiscriptionBox from '../Components/DiscriptionBox/DiscriptionBox';
import RelatedProduct from '../Components/RelatedProduct/RelatedProduct';
import { useSelector,useDispatch } from 'react-redux';

function Product() {
  
  const dispatch = useDispatch();
  //we can rename it
  const all_products = useSelector((state)=>state.auth.all_products);

  useEffect(() => {
    if (all_products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, all_products.length]);

  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  console.log(productId)
  


  useEffect(() => {
    if (all_products.length > 0) {
      const foundProduct = all_products.find((e) => String(e._id) === String(productId));
      setProduct(foundProduct);
    }
  }, [all_products, productId]);


  if(all_products.length === 0){
    return(
      <><h1>loading.....</h1></>
    )
  }

  return (
    <div>
      {product ? (
        <>
          <Breadcrum product={product} />
          <ProductDisplay product={product} />
          <DiscriptionBox />
          <RelatedProduct />
        </>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default Product;
