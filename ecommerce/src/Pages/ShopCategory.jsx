import React, { useContext ,useEffect} from 'react'
import './CSS/ShopCategory.css'
import { useDispatch,useSelector } from 'react-redux'
import dropdown_icon from "../Components/Assets/dropdown_icon.png"
import Item from '../Components/Item/Item.jsx'
function ShopCategory(props) {

  const dispatch = useDispatch();
  //we can rename it
  let all_products = useSelector((state)=>state.auth.all_products);

  useEffect(() => {
    if (all_products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, all_products.length]);

  if(all_products.length === 0){
    return(
      <><h1>loading.....</h1></>
    )
  }
  
  return (
    <div className='shop-category'>
       <img className='shop-category-banner'  src={props.banner} alt="props.category" />
       <div className="shopcategory-indexSort">
          <p>
            <span>
              showing 1-12
            </span>out of 36 products
          </p>
          <div className="shopcategory-sort">
            Sort by <img src={dropdown_icon} alt='dropdown' />
          </div>
       </div>
       <div className='shopcategory-products'>
        {all_products.map((item, i) => {
          if(props.category === item.category){
            return <Item key={i} id={item._id} name={item.name} main_image={item.main_image} new_price={item.new_price} old_price={item.old_price} />
          }
          else{
            return null;
          }
        })}
       </div>
       <div className='shopcategory-loadmore'>
        Explore more
       </div>
    </div>
  )
}

export default ShopCategory