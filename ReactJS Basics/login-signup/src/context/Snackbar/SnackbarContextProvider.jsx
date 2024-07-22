import React, { useState, useContext } from "react";
import MySnackbar from "../../components/Snackbar/MySnackbar";
import SnackbarContext from "./SnackbarContext";

const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const showSnackbar = ({ message, type }) => {
    setSnackbar({ open: true, message, type });
  };
  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <MySnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
