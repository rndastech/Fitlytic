"use client"

import { useEffect, useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import { Link } from "react-router-dom"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import exerSightsLogo from "../assets/logos/logoNoName.png"
import exerSightsNameWhite from "../assets/logos/productNameWhite.png"
import HomeIcon from "@mui/icons-material/HomeRounded"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import InfoIcon from "@mui/icons-material/InfoRounded"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { provider } from "../firebaseConfig"
import { signInWithPopup, signOut } from "firebase/auth"
import { useLocation, useNavigate } from "react-router-dom"

/**
 * Menubar is a component that displays a navigation bar with links for all of the main pages.
 * Redesigned with a modern futuristic theme using golden yellow and black.
 * The links are implemented using `react-router-dom` for client-side navigation.
 * The navigation bar appears at the top of the page (it is not a sidebar).
 *
 * @component
 * @returns {JSX.Element} A Material UI AppBar with futuristic navigation styling.
 */
function Menubar(props) {
  const menuItems = [
    { text: "HOME", path: "/home", icon: <HomeIcon /> },
    { text: "EXERCISE LIBRARY", path: "/catalog", icon: <FitnessCenterIcon /> },
    { text: "MULTI STEP STACK UP", path: "/program", icon: <AutoAwesomeIcon /> },
    { text: "ABOUT PROJECT", path: "/about", icon: <InfoIcon /> },
  ]
  const auth = getAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [isAuth, setIsAuth] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      console.log("User logged in successfully!")
    } catch (error) {
      console.error("Login Error: ", error)
    }
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully!")
        if (location.pathname === "/myExerSights") {
          navigate("/home")
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error)
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true)
      } else {
        setIsAuth(false)
      }
    })

    return () => unsubscribe()
  }, [auth])

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        mt: "0.25rem",
        mb: "1rem",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 100%)",
        borderBottom: "2px solid #FFD700",
        boxShadow: "0 4px 20px rgba(255, 215, 0, 0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            flexGrow: 1,
            flexBasis: "0%",
            alignItems: "center",
            textDecoration: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))",
            },
          }}
        >
          <Box
            component="img"
            src={exerSightsLogo}
            sx={{
              height: "60px",
              width: "60px",
            }}
          />
          <Box
            component="img"
            src={exerSightsNameWhite}
            sx={{
              height: "30px",
              width: "200px",
              ml: "0.5vw",
              filter: "brightness(1.1)",
            }}
          />
        </Box>

        {/* desktop navigation */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            justifyContent: "center",
            gap: "2px",
          }}
        >
          {menuItems.map((item) => (
            <Box key={item.text} sx={{ position: "relative" }}>
              <IconButton
                component={Link}
                to={item.path}
                sx={{
                  gap: "6px",
                  color: "#cccccc",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.1), transparent)",
                    transition: "left 0.5s ease",
                  },
                  ...(location.pathname === item.path && {
                    color: "#FFD700",
                    background: "rgba(255, 215, 0, 0.12)",
                    boxShadow: "0 0 12px rgba(255, 215, 0, 0.25), inset 0 0 12px rgba(255, 215, 0, 0.1)",
                    "&::before": {
                      display: "none",
                    },
                  }),
                  "&:hover": {
                    ...(location.pathname !== item.path && {
                      color: "#FFD700",
                      background: "rgba(255, 215, 0, 0.12)",
                      boxShadow: "0 0 12px rgba(255, 217, 0, 0.30), inset 0 0 12px rgba(255, 217, 0, 0.30)",
                      textShadow: "0 0 10px rgba(0, 217, 255, 0.3)",
                    }),
                  },
                }}
              >
                {item.icon}
                <Typography fontWeight={600} fontSize="0.9rem" letterSpacing="0.5px">
                  {item.text}
                </Typography>
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* login/logout button */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            flexGrow: 1,
            flexBasis: "0%",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {isAuth && (
            <IconButton
              component={Link}
              to="/myExerSights"
              sx={{
                gap: "6px",
                color: "#cccccc",
                padding: "8px 16px",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#00D9FF",
                  background: "rgba(0, 217, 255, 0.08)",
                  boxShadow: "0 0 12px rgba(0, 217, 255, 0.2)",
                },
              }}
            >
              <AccountCircleIcon />
              <Typography fontWeight={500} fontSize="0.9rem">
                MY FITLYTIC
              </Typography>
            </IconButton>
          )}
          <Button
            onClick={isAuth ? handleLogout : handleLogin}
            sx={{
              color: "#000000",
              background: "linear-gradient(135deg, #FFD700 0%, #FFC700 100%)",
              padding: "8px 20px",
              borderRadius: "4px",
              fontWeight: 600,
              fontSize: "0.9rem",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255, 215, 0, 0.2)",
              "&:hover": {
                boxShadow: "0 6px 25px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            {isAuth ? "Logout" : "Login"}
          </Button>
        </Box>

        {/* drawer icon for mobile */}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            flexGrow: 1,
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "#cccccc",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#FFD700",
              },
            }}
          >
            {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        {/* mobile drawer */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              maxWidth: "30vw",
              background: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 100%)",
              borderLeft: "2px solid #FFD700",
              boxShadow: "-4px 0 20px rgba(255, 215, 0, 0.15)",
            },
          }}
        >
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItem
                button
                component={Link}
                key={item.text}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  my: "4px",
                  mx: "8px",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                  color: location.pathname === item.path ? "#FFD700" : "#cccccc",
                  background: location.pathname === item.path ? "rgba(255, 215, 0, 0.12)" : "transparent",
                  boxShadow: location.pathname === item.path ? "0 0 12px rgba(255, 215, 0, 0.2)" : "none",
                  "&:hover": {
                    color: "#00D9FF",
                    background: "rgba(0, 217, 255, 0.08)",
                    boxShadow: "0 0 12px rgba(0, 217, 255, 0.2)",
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                  }}
                />
              </ListItem>
            ))}
            {isAuth && (
              <ListItem
                button
                component={Link}
                to="/myExerSights"
                onClick={handleDrawerToggle}
                sx={{
                  my: "4px",
                  mx: "8px",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                  color: "#cccccc",
                  "&:hover": {
                    color: "#00D9FF",
                    background: "rgba(0, 217, 255, 0.08)",
                    boxShadow: "0 0 12px rgba(0, 217, 255, 0.2)",
                  },
                }}
              >
                <ListItemText
                  primary={"MY EXERSIGHTS"}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                  }}
                />
              </ListItem>
            )}
            <ListItem
              button
              onClick={() => {
                isAuth ? handleLogout() : handleLogin()
                handleDrawerToggle()
              }}
              sx={{
                my: "4px",
                mx: "8px",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, #FFD700 0%, #FFC700 100%)",
                color: "#000000",
                fontWeight: 600,
                "&:hover": {
                  boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                },
              }}
            >
              <ListItemText
                primary={isAuth ? "LOGOUT" : "LOGIN"}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                }}
              />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}

export default Menubar
