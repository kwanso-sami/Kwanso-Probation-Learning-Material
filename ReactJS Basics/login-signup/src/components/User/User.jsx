import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import { Box, Typography } from "@mui/material";

const User = () => {
  const { user } = useContext(UserContext);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "orange",
        color: "black",
        textAlign: "center",
        padding: "5rem",
      }}
    >
      <Typography variant="h3" gutterBottom>
        {user.firstName} {user.lastName}
      </Typography>
      <Typography variant="h5">{user.email}</Typography>
    </Box>
  );
};

export default User;
