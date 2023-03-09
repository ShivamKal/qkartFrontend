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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import  BasicRating from './MUI/Rating'
const ProductCard = ({ product, handleAddToCart }) => {
  console.log(product, handleAddToCart )
  return (
    <Card 
      //sx={{ maxWidth: 275 }}
      >
      <CardMedia
        sx={{ height: 340 }}
        image={product?.image}
        title="green iguana"
      />
      <CardContent>
      <Typography variant="h6" gutterBottom>
        {product?.name}
      </Typography>
      <Typography variant="h6" margin="normal" >
        <strong>{"$"+product?.cost}</strong>
      </Typography>
        {/* <Rating
          name="simple-controlled"
          value={product?.rating}
        /> */}
        <BasicRating rating={product?.rating} />
      </CardContent>
      <CardActions fullWidth>
        <Button className="card-button-custom" fullWidth variant="contained"><AddShoppingCartIcon />ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
