import React, { useContext, useEffect } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {fetchProducts} from '../../ReduxStore/AuthSlice.jsx'
import './Popular.css';
import Item from '../Item/Item.jsx';

function Popular() {
  const dispatch = useDispatch();
  //we can rename it
  const all_products = useSelector((state)=>state.auth.all_products);

  useEffect(() => {
    if (all_products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, all_products.length]);


  if(all_products.length < 0){
    return(
      <>
      <h1>LOADING......</h1>
      </>
    )
  }
  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {all_products.length > 0 ? (
          all_products.map((item,i) => {
            if(item.category == 'women'){
              return <Item 
              key={item.id} 
              id={item._id} 
              name={item.name} 
              main_image={item.main_image} 
              new_price={item.new_price} 
              old_price={item.old_price} 
            />
            }
            
          })
        ) : (
          <p>Loading products...</p>  
        )}
      </div>
    </div>
  );
}

export default Popular;
