import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({ firstName: decoded.firstName, email: decoded.sub });
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: "transparent",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              px: { xs: 2, sm: 4, md: 8, lg: 4 },
            }}
          >
            <div className="flex items-center space-x-2">
              <Database
                className="text-cyan-400"
                style={{
                  width: "clamp(24px, 4vw, 32px)",
                  height: "clamp(24px, 4vw, 32px)",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: {
                    xs: "1.125rem",
                    sm: "1.25rem",
                    md: "1.5rem",
                    lg: "1.875rem",
                  },
                }}
              >
                PromptSQL
              </Typography>
            </div>

            <Box>
              {!user ? (
                <button
                  className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-md transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </button>
              ) : (
                <>
                  <Avatar
                    src="https://t4.ftcdn.net/jpg/09/17/12/23/360_F_917122367_kSpdpRJ5Hcmn0s4WMdJbSZpl7NRzwupU.jpg"
                    alt={user.firstName}
                    onClick={handleAvatarClick}
                    sx={{
                      cursor: "pointer",
                      height: { xs: 36, sm: 40, md: 45 },
                      width: { xs: 36, sm: 40, md: 45 },
                    }}
                  ></Avatar>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
