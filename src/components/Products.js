import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Stack,Button
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart.js"
import {generateCartItemsFrom} from "./Cart.js"
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


 
const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const[Products,setProduct]=useState([]);
  const[showProducts,setShowProducts]=useState(true);
  const[filteredProducts, setFilteredProducts] = useState([]);
  const[loading,setLoading]=useState(true);
  const[searchKey,setSearch]=useState();
  // const[ timeoutID ,setTimeOutID]=useState()
   const[ debounceTimeout ,setDebounceTimeout]=useState(0)
  let url=config.endpoint+"/products";
  const[CartData,setCartData]=useState();
  const[name,setName]=useState("");
  const[CartDataDetails,setCartDataDetails]=useState([])
  
  
  // let pro=
  // {
  // "name":"Tan Leatherette Weekender Duffle",
  // "category":"Fashion",
  // "cost":150,
  // "rating":4,
  // "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  // "_id":"PmInA797xJhMIPti"
  // }
  useEffect(async() => {
  const user_name = localStorage.getItem("username");
  const user_token = localStorage.getItem("token");
  setName(user_name)
   const product= await performAPICall();
   setProduct(product)
  //  console.log("product")
  //  console.log(Products)
  // postItems(user_token)
  if(user_token)
  {
  let cart_data=await fetchCart(user_token)
  setCartData(cart_data)
  // console.log("cart data")
  // console.log(CartData)
  let cart_details=generateCartItemsFrom(cart_data,product);
  console.log(cart_details)
  setCartDataDetails(cart_details)
  }
  }, []);


 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
   const performAPICall = async () => {
   
     
    try{
      // console.log("came")
      let response= await axios.get(url);
      setLoading(false)
      // console.log(response);
      setProduct(response.data);
      return response.data;
    }
    catch(err)
    {
      if(err.response)
      enqueueSnackbar(err.response.data.message,{variant:"error",autoHideDuration:3000});
      else
      {
       enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: "error",autoHideDuration:3000})
     }
     
    }
  };

 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true)
    setShowProducts(false)
    try{
      if(text==null)
      setShowProducts(true)
      // console.log("came in with "+text)
      // setSearch(text);
      let search_url=config.endpoint+`/products/search?value=${text}`
      let search_response= await axios.get(search_url)
      // console.log(search_response)
      setLoading(false)
      setFilteredProducts(search_response.data)
    }
    catch(err)
    {
      setLoading(false)
      if(err.response && err.response.status==404)
      setFilteredProducts([])
      else
      {
       enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: "error",autoHideDuration:3000})
      }

 
    }
   

 
  };

 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    let search = event.target.value;
    setSearch(search);
   
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    let timeOut = setTimeout(() => {
      performSearch(search);
    }, 500);
    // Update set timeoutId
    setDebounceTimeout(timeOut);
};

const fetchCart = async(user_token)=>
{
  if(user_token)
  {
  // console.log(user_token)
  let url=config.endpoint+"/cart";
  try{
    // console.log("came")
    let response= await axios.get(url, 
     { headers: { 'Authorization': `Bearer ${user_token}`}}
  );
  // console.log("inside fetch")
  // console.log(response)
    //  console.log(response.data);
     return(response.data);
  }
  catch(err)
  {
    if(err.response)
    enqueueSnackbar(err.response.data.message,{variant:"error",autoHideDuration:3000});
    else
    {
     enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: "error",autoHideDuration:3000})
   }
  }
}
}
 
const postItems=async(user_token,data)=>
{
  let url=config.endpoint+"/cart"
  console.log("in adding items")
  try{
  let response=await axios.post(url, data
  , {
    headers: {
      'Authorization': `Bearer ${user_token}` 
    }
  })
  // // console.log("inside post")
  // console.log(response)
  setCartData(response.data)
  let cart_details=generateCartItemsFrom(response.data,Products);
  setCartDataDetails(cart_details)

}
catch(err)
  {
    if(err.response)
    enqueueSnackbar(err.response.data.message,{variant:"error",autoHideDuration:3000});
    else
    {
     enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: "error",autoHideDuration:3000})
   }
  }
}

 // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i=0;i<items.length;i++)
  {
        if(items[i].productId===productId)
        {
         return true
        }
      
    }
  return false;

  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(token)
    {
    if(options)
    {
      if(isItemInCart(CartData,productId))
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item",{variant: "warning",autoHideDuration:3000})
      else
      {
         console.log("will do post wait preethi")
         postItems(token,items)
      }
    }
    else
    {
      console.log("will do post wait preethi")
      postItems(token,items)
    }
    }
    else{
      enqueueSnackbar("Login to add an item to the Cart",{variant: "error",autoHideDuration:3000})

    }
    console.log("inside add to cart");
    console.log(token);
    console.log(items);
    console.log(products);
    console.log(productId);
    console.log(qty);
    console.log(options);

  };




 
  return (
    <div>
       {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      <Header children={
        <Box className="search">
      <TextField
        className="search-desktop"
        size="small"
        value={searchKey}
        fullWidth
        onChange={(event)=>{debounceSearch(event,debounceTimeout)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      /> </Box>}>
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        value={searchKey}
        fullWidth
        onChange={(event)=>{debounceSearch(event,debounceTimeout)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      {name?
      (
        <Grid container>
        <Grid container md={9} xs={12} spacing={2} >
          <Grid item className="product-grid" md={12}>
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          <Grid container spacing={2}>
          {loading?
          (<Grid container item className="loading" direction="column"  > <CircularProgress ></CircularProgress><p>Loading Products...</p></Grid>):
          (showProducts?
           
           Products.map((val,index)=>
           {
             return (
               <Grid item xs={6} md={3} className="product-grid" key={index}>
                 <ProductCard product={val} handleAddToCart={addToCart}
                 />
               </Grid>
             );
           }):
           (
             filteredProducts.length>0?
             (
               filteredProducts.map((val,index) => {
                   return (
                     <Grid item xs={6} md={3} className="product-grid" key={index}>
                       <ProductCard product={val} handleAddToCart={addToCart}
                       />
                     </Grid>
                   );
                 })
 
             ):
             (
               <Grid container item className="loading" direction="column" > <SentimentDissatisfied></SentimentDissatisfied><p>No products found</p></Grid>
             )
           )
           
           )
          
           }
          
           </Grid>
           </Grid>
           <Grid Container spacing={1} xs={12} md={3} bgcolor="#E9F5E1" >
           <Grid item >
           <Cart product={Products}
             items={CartDataDetails}
             handleQuantity={addToCart}>
             </Cart>
             </Grid>
           </Grid>
           </Grid>

       ):
      ( <Grid container spacing={2} marginBottom={2}>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {loading?
        (<Grid container item className="loading"  direction="column" > <CircularProgress ></CircularProgress><p>Loading Products...</p></Grid>):
        (showProducts?
         Products.map((val,index)=>
         {
           return (
             <Grid item xs={12} md={3} className="product-grid" key={index}>
               <ProductCard product={val} handleAddToCart={addToCart}
               />
             </Grid>
           );
         }):
         (
           filteredProducts.length>0?
           (
             filteredProducts.map((val,index) => {
                 return (
                   <Grid item xs={12} md={3} className="product-grid" key={index}>
                     <ProductCard product={val} handleAddToCart={addToCart}
                     />
                   </Grid>
                 );
               })

           ):
           (
             <Grid container item className="loading" direction="column" > <SentimentDissatisfied></SentimentDissatisfied><p>No products found</p></Grid>
           )
         ))
         
         }
      </Grid>
      )}

  
      <Footer />
    </div>
  );
};
// export {performSearch};
export default Products;

