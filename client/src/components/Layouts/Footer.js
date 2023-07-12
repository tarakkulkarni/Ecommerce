import React from "react";
import { NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <div className="bg-dark text-light p-3 text-center">
      <h4 className="text-center">Made By Tarak Kulkarni</h4>
      <div className="d-inline-flex p-2">
        <div>
          <div>
            <NavLink to="/about" style={{ textDecoration: "none" }}>
              About
            </NavLink>
          </div>
          <div>
            <NavLink to="/contact" style={{ textDecoration: "none" }}>
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
