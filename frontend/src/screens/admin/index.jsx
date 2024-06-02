import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import PageNotFound from "../../components/PageNotFound";
import ProductsOverview from "./ProductsOverview";
import ResponsiveDrawer from "../../components/NewDrawer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ListAltOutlined from "@mui/icons-material/ListAltOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TransactionScreen from "./Transaction";
import CustomerScreen from "./Customers";
import DemandForcast from "./PredictTransaction";
import Box from "@mui/material/Box";

const AdminStack = () => {
  const navItemList = [
    { name: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    {
      name: "Products",
      icon: <InventoryIcon />,
      link: "/productsoverview",
    },
    {
      name: "Transaction",
      icon: <AccountBalanceIcon />,
      link: "/transactionoverview",
    },
    {
      name: "Customer",
      icon: <PeopleIcon />,
      link: "/customeroverview",
    },
    {
      name: "AI Predict",
      icon: <AutoAwesomeIcon />,
      link: "/demandForcast",
    },
  ];

  return (
    <ResponsiveDrawer navItems={navItemList}>
      <Box className="sub-base-view" sx={{ backgroundColor: "#EFF4FB" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />}></Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productsoverview" element={<ProductsOverview />} />
          <Route path="/transactionoverview" element={<TransactionScreen />} />
          <Route path="/customeroverview" element={<CustomerScreen />} />
          <Route path="/demandForcast" element={<DemandForcast />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>
    </ResponsiveDrawer>
  );
};

export default AdminStack;
