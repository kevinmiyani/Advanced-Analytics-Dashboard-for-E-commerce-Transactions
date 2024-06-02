import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoadingPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <CircularProgress />
      <Typography variant="h6" color="textPrimary" mt={2}>
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
