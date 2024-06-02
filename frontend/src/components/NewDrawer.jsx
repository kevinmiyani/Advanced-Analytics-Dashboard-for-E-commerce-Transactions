import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/authActions";

const drawerWidth = 210;

const ResponsiveDrawer = (props) => {
  const { children, navItems } = props;
  const navigate = useNavigate();
  const { pathname } = window.location;
  const type = localStorage.getItem("access_type");
  const [mobileOpen, setMobileOpen] = useState(false);
  const userDetails = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 55,
          gap: 1,
        }}
      >
        <Typography sx={{ color: "#fff", letterSpacing: 1 }}>
          Analytics Dashboard
        </Typography>
      </Box>
      <List>
        {navItems.map((item, index) => (
          <ListItemButton
            key={index}
            sx={{
              height: 55,
              px: 2.5,
            }}
            onClick={() => {
              setMobileOpen(false);
              navigate(item.link);
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: "center",
                mr: 1,
                color: pathname.includes(item.link) ? "white" : "black",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <Typography
              sx={{
                color: pathname.includes(item.link) ? "white" : "black",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              {item.name}
            </Typography>
          </ListItemButton>
        ))}
        <ListItemButton
          sx={{
            height: 55,
            px: 2.5,
          }}
          onClick={() => {
            localStorage.setItem("access_token", "");
            localStorage.setItem("access_type", "");
            dispatch(setUser(null));
            navigate("/");
            window.location.reload();
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: "center",
              mr: 1,
              color: "black",
            }}
          >
            <InboxIcon />
          </ListItemIcon>
          <Typography sx={{ color: "black", fontSize: 15, fontWeight: "bold" }}>
            logOut
          </Typography>
        </ListItemButton>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "#fff",
          boxShadow: "0px 3px 6px 1px rgba(0,0,0,0.16)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",

            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <MenuIcon
            sx={{ color: "#000", display: ["block", "none"] }}
            onClick={() => setMobileOpen(!mobileOpen)}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#000",
              display: ["none", "block"],
            }}
          >
            {userDetails?.role ?? type} SECTION
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#4b7fd7",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#4b7fd7",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Toolbar />
        <>{children}</>
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
