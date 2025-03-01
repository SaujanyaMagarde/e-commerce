import React, { useContext,useEffect } from 'react'
import './RelatedProduct.css'
import Item from "../Item/Item.jsx"
import { useSelector,useDispatch } from 'react-redux';
function RelatedProduct() {
  const dispatch = useDispatch();
  //we can rename it
  const all_products = useSelector((state)=>state.auth.all_products);

  useEffect(() => {
    if (all_products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, all_products.length]);

  if(all_products.length == 0){
    return(
      <>
      <h1>LOADING....</h1>
      </>
    )
  }
  return (

    <div className='relatedproducts'>
        <h1>
            RELATED PRODUCTS
        </h1>
        <hr/>
        <div className="relatedproducts-item">
            {all_products.map((item,i)=>{
                return <Item key={i} id={item._id} name={item.name} main_image={item.main_image} new_price={item.new_price} old_price={item.old_price} />
            })}
        </div>
    </div>
  )
}

export default RelatedProduct