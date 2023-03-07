import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect} from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  let history = useHistory();
  const logout = () => {
      localStorage.removeItem("username")
      localStorage.removeItem("token")
      localStorage.removeItem("balance")
      history.push('/')
      window.location.reload()
  }
  let username = localStorage.getItem("username") || ""
  let box  = <Box></Box>;
  let exploreBtn = <Button></Button>;
  if(!hasHiddenAuthButtons) box = children;
  if(hasHiddenAuthButtons){
    exploreBtn =  <Button
    className="explore-button"
    startIcon={<ArrowBackIcon />}
    variant="text"
    onClick={() => history.push('/')}
    >
      Back to explore
    </Button>
  }
  else if(username){
    exploreBtn = <Stack direction="row" alignItems="center" sapcing={1}>
      <Avatar src="avatar.png" alt={username} />
      <p className="m-2">{username}</p>
      <Button onClick={logout} variant="text">
        LOGOUT
      </Button>
    </Stack>
  }
  else{
    exploreBtn = <Stack direction="row" alignItems="center" sapcing={1}>
      <Button onClick={() => {history.push('/login',{})}} variant="text">
          LOGIN
        </Button>
        <Button onClick={() => {history.push('/register',{})}} variant="contained">
          REGISTER
        </Button>
      </Stack>
  }
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {box}
        {exploreBtn}
      </Box>
    );
};

export default Header;
