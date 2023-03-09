import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import Card from './asssets/Card';
const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card key={product.key} className="card" image={product.image} title={product.name} cost={product.cost} rating={product.rating} onClick={handleAddToCart}/>
  );
};

export default ProductCard;
