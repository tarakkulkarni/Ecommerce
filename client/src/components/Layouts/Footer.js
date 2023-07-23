import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="footer">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.8rem",
          marginTop: "1rem",
        }}
      >
        <h4>Made By Tarak Kulkarni</h4>
        <div className="footer-links">
          <div className="footer-link">
            <NavLink to="/about" className="footer-link">
              About
            </NavLink>
          </div>
          <div>
            <NavLink to="/contact" className="footer-link">
              Contact
            </NavLink>
          </div>
        </div>
        <ul className="social-links">
          <li>
            <div className="footer-link">
              <FaTwitter />
            </div>
          </li>
          <li>
            <div className="footer-link">
              <FaInstagram />
            </div>
          </li>
          <li>
            <div className="footer-link">
              <FaFacebook />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Footer;
