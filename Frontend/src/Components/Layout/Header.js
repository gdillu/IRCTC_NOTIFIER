import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import HeaderItems from "./Header-Items";
import { useNavigate } from "react-router-dom";


const ResponsiveAppBar = () => {

  const isAuthenticated = localStorage.getItem("isLoggedIn");
  const navigate = useNavigate();

  let authentication = "Sign Up / Login";
  if (isAuthenticated) authentication = "Sign out";

  const pages = ["Check trains", authentication];

  const logoClickHandler = () => {
    navigate("/");
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
