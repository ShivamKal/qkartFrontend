import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const loggedIn = window.localStorage.getItem("username");
  const token = window.localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState({
    products: [],
    loading: false,
    cartItems: [],
  });
  const [debounceTimeout, setDebounceTimeout] = useState(setTimeout(() => {}, 500));
  const [cartLoad, setCartLoad] = useState(false);

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);
  const performAPICall = async () => {
    setProducts((prevState) => ({
      ...prevState,
      loading: true,
    }));
    await axios
      .get(`${config.endpoint}/products`)
      .then((response) => {
        setProducts((prevState) => ({
          ...prevState,
          products: response.data,
          loading: false,
        }));
        setCartLoad(true);
      })
      .catch(() => {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { variant: "error" }
        );
        setProducts((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  };

  const performSearch = async (text) => {
    await axios
      .get(`${config.endpoint}/products/search?value=${text}`)
      .then((response) => {
        setProducts((prevState) => ({
          ...prevState,
          products: response.data,
        }));
      })
      .catch((error) => {
        if (error.response !== undefined && error.response.status === 404) {
          setProducts((prevState) => ({
            ...prevState,
            products: [],
          }));
          enqueueSnackbar("No products found", { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check the backend console for more details",
            { variant: "error" }
          );
        }
      });
  };

  const handleSubmit = (event) => {debounceSearch(event, debounceTimeout);};
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    setDebounceTimeout(
      setTimeout(() => {
        performSearch(event.target.value);
      }, 500)
    );
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (products.products.length !== 0) {
        setProducts((prevState) => ({
          ...prevState,
          cartItems: generateCartItemsFrom(response.data, products.products),
        }));
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const isItemInCart = (items, productId) => {
    var isIn = false;
    items.forEach((item) => {
      if (item.productId === productId) isIn = true;
    });
    return isIn;
  };


  const handleCart = (productId) => {
    addToCart(token, products.cartItems, products.products, productId, 1);
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      if (!isItemInCart(items, productId)) {
        console.log("clicked", productId);
        addInCart(productId, qty);
      } else {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item",
          { variant: "warning" }
        );
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  const handleQuantity = (productId, qty) => {
    addInCart(productId, qty);
  };

  const addInCart = async (productId, qty) => {
      await axios
      .post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setProducts((prevState) => ({
          ...prevState,
          cartItems: generateCartItemsFrom(response.data, products.products),
        }));
      })
      .catch((error) => {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      });
  };

  return (
    <div>
      <Header loggedIn={loggedIn} hasHiddenAuthButtons>
        <Box sx={{ width: "45vw" }}>
          <TextField
            className="search-desktop"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            onChange={handleSubmit}
            placeholder="Search for items/categories."
            name="search"
          />
        </Box>
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={handleSubmit}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={loggedIn !== null ? 9 : 12}>
          <Grid container spacing={2}>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            {products.loading ? (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                mt={6}
                mb={6}
              >
                <Grid item>
                  <CircularProgress
                    size={40}
                    color="success"
                    className="loading"
                  />
                </Grid>
                <Grid item>
                  <div>Loading Products...</div>
                </Grid>
              </Grid>
            ) : (
              <>
                {products.products.length === 0 ? (
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    mt={6}
                    mb={6}
                  >
                    <Grid item>
                      <SentimentDissatisfied size={40} className="loading" />
                    </Grid>
                    <Grid item>
                      <div>No products found</div>
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    {products.products.map((product) => (
                      <Grid item xs={12} sm={6} md={3} key={product._id}>
                        <ProductCard
                          product={product}
                          handleAddToCart={(event) => handleCart(product._id)}
                        />
                      </Grid>
                    ))}
                  </>
                )}
              </>
            )}
          </Grid>
        </Grid>
        {loggedIn !== null && (
          <Grid item xs={12} md={3}>
            <Cart
              products={products.products}
              items={products.cartItems}
              handleQuantity={handleQuantity}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
