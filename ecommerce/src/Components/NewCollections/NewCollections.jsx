import React, { useContext , useEffect } from 'react'
import './NewCollection.css'
import Item from '../Item/Item.jsx'
import {useSelector,useDispatch} from 'react-redux';
import {fetchProducts} from '../../ReduxStore/AuthSlice.jsx'

function NewCollections() {
  const dispatch = useDispatch();
    //we can rename it
    const all_products = useSelector((state)=>state.auth.all_products);
  
    useEffect(() => {
      if (all_products.length === 0) {
        dispatch(fetchProducts());
      }
    }, [dispatch, all_products.length]);
  

  if(all_products.length == 0){
    return (
      <>
      <h1>LOADING.....</h1>
      </>
    )
  }
  return (
    <div className='new-collections'>
      <h1>New Collections</h1>
      <hr />
      <div className='collections'>
        {
          all_products.slice(7, 10).map((item, i) => (  // Use slice(0, 4) instead of break
            <Item 
              key={i} 
              id={item._id} 
              name={item.name} 
              main_image={item.main_image} 
              new_price={item.new_price} 
              old_price={item.old_price} 
            />
          ))
        }
      </div>
    </div>
  )
}

export default NewCollections
