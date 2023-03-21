import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {
  const token = localStorage.getItem("token");
  // console.log("token is ")
  // console.log(token);
  // console.log(product);
  return (
   
    <Card className="card" >
      <CardMedia
        component="img"
        alt="product"
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        {product.name}
        </Typography>
        <Typography variant="body1" >
         <strong>${product.cost}</strong>
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button name="add to cart" variant="contained" className="card-button" onClick={()=>{handleAddToCart(token,{"productId":product._id,"qty":1},product,product._id,true)}} fullWidth><AddShoppingCartOutlined ></AddShoppingCartOutlined >&nbsp; ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
