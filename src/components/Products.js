import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Autocomplete,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { spacing } from '@mui/system';
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import SearchIcon from '@mui/icons-material/Search';
import CircularIndeterminate from "./MUI/Loading";
const Products = () => {
  const [products, setProducts] = useState({
    loading: false,
    product: []
  });
  const [debounceTimeout, setDebounceTimeout] = useState(setTimeout(() => {}, 500))
  const { enqueueSnackbar } = useSnackbar()

  const performAPICall = async () => {
    setProducts(prevState => {
      return {
        ...prevState,
        loading: true
      }
    })
    try {
       await axios
       .get(`${config.endpoint}/products`)
       .then((response)=> {
        setProducts(prevState => {
          return {
            ...prevState,
            product: response?.data,
            loading: false
          }
        })
       });
    } catch (e) {
      const errObj = {...e}
      enqueueSnackbar(errObj?.response?.data?.message, {variant: "warning"})
    }
    setProducts(prevState => {
      return {
        ...prevState,
       loading: false
      }
    })
  };
  useEffect(() => {
    performAPICall();
  },[]);

  const performSearch = async (text) => {
    setProducts(prevState => {
      return {
        ...prevState,
        loading: true
      }
    })
    try {
       await axios
       .get(`${config.endpoint}/products/search?value=${text}`)
       .then((response)=> {
        console.log("search -->", response?.data)
        setProducts(prevState => {
          return {
            ...prevState,
            product: response?.data
          }
        })
       });
    } catch (e) {
      const error = {...e}
      console.log("search -->", error)
      if (error.response !== undefined && error.response.status === 404) {
        setProducts((prevState) => ({
          ...prevState,
          product: error?.response?.data,
        }));
        enqueueSnackbar("No products found", { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { variant: "error" }
        );
      }
    }
    setProducts(prevState => {
      return {
        ...prevState,
       loading: false
      }
    })
  };
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout)
    setDebounceTimeout(
      setTimeout(() => {
        performSearch(event.target.value)
      }, 500)
    )
  }
  const handleAddToCart = () => {

  }
  return (
    <div>
      <Header></Header>
       <Grid container>
        <TextField 
          id="outlined-basic" 
          placeholder="Search for items/categories" 
          fullWidth 
          variant="outlined" 
          onChange={(e) => debounceSearch(e, debounceTimeout)}
          InputProps={{
            endAdornment: 
            <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              edge="end"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>,
          }}

          />
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>
       <Grid container centered>
           {!products?.loading ? (products?.product?.length > 0 ? products?.product?.map((product, index) => {
            return (
              <Grid key={index} item xs={6} md={3}sm={{margin: 2}} className="product-grid"><ProductCard product={product} handleAddToCart={handleAddToCart} /> </Grid>
            )
           })
          :  <div className="loading-section" centered fullWidth>No Products Found</div>) : <div centered className="loading-section"><CircularIndeterminate />Loading Products</div>
          }
       </Grid>
      
      <Footer />
    </div>
  );
};
export default Products;
