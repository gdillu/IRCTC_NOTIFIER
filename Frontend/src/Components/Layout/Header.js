import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import HeaderItems from "./Header-Items";
// import { useNavigate } from "react-router-dom";
import MenuItems from "./MenuItem";
// import {useDispatch} from 'react-redux'
// import { authActions } from "../Store/auth-store";

const pages = ["Check trains", "Login/Sign up"];

const ResponsiveAppBar = () => {
  // const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openMenu,setOpenMenu] = React.useState(false);
  const isAuthenticated = localStorage.getItem("isLoggedIn")

  let authentication = "Sign in";
  if (isAuthenticated) authentication = "Sign out";
  else authentication = "Sign in";
  
  const settings = [authentication];
  // const history = useNavigate ();
  // const dispatch = useDispatch();

  const handleOpenUserMenu = (event) => {
    setOpenMenu(state => !state);
    // setAnchorElUser((event.currentTarget));
  };

  const menuLogoClickHandler = () => {
    setOpenMenu(state => !state);
  };

  const menuItemClickHandler = (menuName) =>{
    // if(menuName === "Sign in")
    //   history.push("/login");
    // else if (menuName === 'Sign out'){
    //   dispatch(authActions.logout())
    //   history.push("/")
    // }
      
  }

  const logoClickHandler = () => {
    // history.push("/");
  };

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            onClick={logoClickHandler}
          >
            Home
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <HeaderItems page={page} key={page}/>
            ))}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
