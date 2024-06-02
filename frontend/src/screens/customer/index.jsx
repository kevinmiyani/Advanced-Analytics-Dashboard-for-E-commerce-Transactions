import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import PageNotFound from "../../components/PageNotFound";

import Box from "@mui/material/Box";

const AdminStack = () => {
  return (
    <Box className="sub-base-view" sx={{ backgroundColor: "#EFF4FB" }}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Box>
  );
};

export default AdminStack;
