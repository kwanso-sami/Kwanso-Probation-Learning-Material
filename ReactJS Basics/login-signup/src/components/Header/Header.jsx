import React, { useContext } from "react";
import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Link,
  Box,
  Container,
} from "@mui/material";
import UserContext from "../../context/User/UserContext";

export default function Header() {
  const { isLoggedIn, setUser, setIsLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const signOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: "white", borderBottom: "1px gray" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton component={RouterLink} to="/">
              <img
                src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                alt="Logo"
                style={{ height: 48 }}
              />
            </IconButton>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link
                component={NavLink}
                to="/"
                underline="none"
                sx={{
                  py: "6px",
                  px: "12px",
                  color: "black",

                  "&.active": {
                    color: "#C2410C",
                  },
                }}
              >
                <Typography variant="body2">Home</Typography>
              </Link>

              {isLoggedIn && (
                <Link
                  component={NavLink}
                  to="/user"
                  underline="none"
                  sx={{
                    py: "6px",
                    px: "12px",
                    color: "black",
                    "&.active": {
                      color: "#C2410C",
                    },
                  }}
                >
                  <Typography variant="body2">Profile</Typography>
                </Link>
              )}
            </Box>

            <Box>
              {isLoggedIn ? (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: "#C2410C",
                    "&:hover": { bgcolor: "#C2410C" },
                  }}
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    component={NavLink}
                    to="/login"
                    size="medium"
                    sx={{
                      color: "black",
                      "&.active": { color: "#C2410C" },
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    component={RouterLink}
                    to="/signup"
                    size="medium"
                    variant="contained"
                    sx={{
                      bgcolor: "#C2410C",
                      "&:hover": { bgcolor: "#C2410C" },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
