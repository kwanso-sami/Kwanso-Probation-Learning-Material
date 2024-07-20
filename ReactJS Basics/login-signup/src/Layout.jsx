import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SnackbarContextProvider from "./context/SnackbarContextProvider";

function Layout() {
  return (
    <>
      <SnackbarContextProvider>
        <Header />
        <Outlet />
        <Footer />
      </SnackbarContextProvider>
    </>
  );
}

export default Layout;
