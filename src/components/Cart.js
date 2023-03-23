import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let cartDataDetails=[]
  // console.log("came hereeeeeeeee") 
  // console.log(cartData);
  // console.log(productsData);
  for(let i=0;i<cartData.length;i++)
  {
    for(let j=0;j<productsData.length;j++)
    {
        if(cartData[i].productId===productsData[j]._id)
        {
        cartDataDetails.push(productsData[j])
        // console.log(cartDataDetails[i])
        cartDataDetails[i].qty=cartData[i].qty;
        }
    }
  }
 console.log("cart data details final")
 console.log(cartDataDetails)
 return cartDataDetails;
  
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let price=0;
  for(let i=0;i<items.length;i++)
  {
    let cost=items[i].qty * items[i].cost;
    price+=cost
  }
  return price
};

const getTotalItems = (items = []) => {
  let qty=0;
  for(let i=0;i<items.length;i++)
  {
    
      qty+=items[i].qty;
  }
  return qty;
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
  return (
    isReadOnly?(
    <Box padding="0.5rem" data-testid="item-qty">
      Qty: {value}
    </Box>
  ):
  (<Stack direction="row" alignItems="center">
    <IconButton size="small" color="primary" onClick={handleDelete}>
      <RemoveOutlined />
    </IconButton>
    <Box padding="0.5rem" data-testid="item-qty">
      {value}
    </Box>
    <IconButton size="small" color="primary" onClick={handleAdd}>
      <AddOutlined />
    </IconButton>
  </Stack>)
  )
};
  


/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly
}) => {
  const user_token = localStorage.getItem("token");
  const history=useHistory()
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((val,index) => {
                   return (
                     
                    <Box display="flex" alignItems="flex-start" padding="1rem">
                        <Box className="image-container">
                            <img
                                // Add product image
                                src={val.image}
                                // Add product name as alt eext
                                alt="Image of product"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            height="6rem"
                            paddingX="1rem"
                        >
                            <div>{val.name}</div>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                            {isReadOnly?
                            ( <ItemQuantity value={val.qty} isReadOnly />):
                            (
                              <ItemQuantity value={val.qty} handleAdd =
                            {
                              async()=>{
                                let new_val=val.qty+1
                                handleQuantity(user_token,{"productId":val._id,"qty":new_val},products,val._id,new_val,false)
                              }
                            }
                            handleDelete=
                            {
                              async()=>{
                                let new_val=val.qty-1
                                handleQuantity(user_token,{"productId":val._id,"qty":new_val},products,val._id,new_val,false)
                              }
                            }
                            // Add required props by checking implementation
                            />
                            )}
                            <Box padding="0.5rem" fontWeight="700">
                                ${val.cost}
                            </Box>
                            </Box>
                        </Box>
                    </Box>
                   );
                 })}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {isReadOnly!=true &&
        (
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => history.push("/checkout", { from: "Cart" })}
          >
            Checkout
          </Button>
        </Box>)
}
      </Box>
     {
      isReadOnly &&
      (
        <Box className="cart">
             <Box padding="1rem" fontWeight="700" fontSize="1.5rem"><strong>Order Details</strong></Box>
             <Box
          padding="0.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
           >
          <Box color="#3C3C3C" alignSelf="center">
           Products
          </Box>
          <Box
            color="#3C3C3C"
            alignSelf="center"
          >
           { getTotalItems(items)}
          </Box>
        </Box>

        <Box
          padding="0.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
           >
          <Box color="#3C3C3C" alignSelf="center">
            Subtotal
          </Box>
          <Box
            color="#3C3C3C"
            alignSelf="center"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        <Box
          padding="0.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
           >
          <Box color="#3C3C3C" alignSelf="center">
            Shipping Charges
          </Box>
          <Box
            color="#3C3C3C"
            alignSelf="center"
            data-testid="cart-total"
          >
            $0
          </Box>
        </Box>

        <Box
          padding="0.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
           >
          <Box color="#3C3C3C" alignSelf="center"fontWeight="700"
            fontSize="1rem">
            Total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        
          </Box>
        
      )
     }


      
      
      
    </>
  );
};

export default Cart;
