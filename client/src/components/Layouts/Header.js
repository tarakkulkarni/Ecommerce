import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import SearchInput from "../Form/SearchInput";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const handleLogOut = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });

    localStorage.removeItem("auth");
    localStorage.removeItem("cart");
    toast.success("Logged out successfully");
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary bg-dark"
      data-bs-theme="dark"
    >
      <div className="container-fluid nav-container">
        <NavLink to="/" className="navbar-brand link-style">
          Ecommerce
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse p-3" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <SearchInput />
            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link link-style"
                aria-current="page"
              >
                Home
              </NavLink>
            </li>
            {!auth.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link link-style">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link link-style">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="nav-link link-style"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    onClick={handleLogOut}
                    to="/login"
                    className="nav-link link-style"
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <Badge count={cart?.length} showZero>
                <NavLink to="/cart" className="nav-link link-style">
                  Cart
                </NavLink>
              </Badge>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Header;
