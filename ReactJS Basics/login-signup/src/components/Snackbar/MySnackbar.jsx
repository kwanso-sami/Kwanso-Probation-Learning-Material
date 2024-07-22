import React from "react";
import { Snackbar, Alert } from "@mui/material";

const MySnackbar = ({ open, message, type, onClose }) => {
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={2000}
        onClose={onClose}
      >
        <Alert
          onClose={onClose}
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MySnackbar;
