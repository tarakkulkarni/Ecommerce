import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "./Layout.css";
const Layout = (props) => {
  return (
    <div>
      <div style={{ position: "relative" }}>
        <title>{props.title}</title>
        <Header />
        <div className="layout-container">
          <ToastContainer />
          {props.children}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
export default Layout;
