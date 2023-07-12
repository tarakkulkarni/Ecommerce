import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { toast } from "react-toastify";
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();
  const getPaymentGatewayToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPaymentGatewayToken();
  }, [auth?.token]);
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/products/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment completed successfully");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const removeCartItem = (pid) => {
    try {
      let cartItems = [...cart];
      let index = cartItems.findIndex((item) => item._id === pid);
      cartItems.splice(index, 1);
      setCart(cartItems);
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.log(error);
    }
  };
  const totalPrice = () => {
    let total = 0;
    cart?.map((item) => {
      return (total = total + item.price);
    });
    return total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length > 0
                ? `You have ${
                    cart.length === 1
                      ? `${cart.length} item`
                      : `${cart.length} items`
                  } in your cart ${
                    auth?.token ? "" : "Please login to checkout"
                  }`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            {cart?.map((p) => (
              <div className="row card flex-row">
                <div className="col-md-4">
                  <img
                    className="card-img-top"
                    src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${p._id}`}
                    alt="Card-cap"
                  />
                </div>
                <div className="col-md-8">
                  <h6>{p.name}</h6>
                  <p>{p.description.substring(0, 30)}</p>
                  <h6>$ {p.price}</h6>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      removeCartItem(p._id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-3 text-center">
            <h4>Cart summary</h4>
            <p>Total | Checkout | Payment</p>
            <h4>Total: {totalPrice()}</h4>
            {auth?.user?.address ? (
              <div>
                <h4>Current Address</h4>
                <h5>{auth?.user?.address}</h5>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => {
                    navigate("/dashboard/user/profile");
                  }}
                >
                  Update Address
                </button>
              </div>
            ) : (
              <div>
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      navigate("/dashboard/user/profile");
                    }}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      navigate("/login", {
                        state: "/cart",
                      });
                    }}
                  >
                    Please Login to Checkout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing..." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
