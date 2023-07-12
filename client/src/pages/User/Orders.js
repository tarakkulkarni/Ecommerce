import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layouts/UserMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getUserOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/orders/user-orders`
      );
      setOrders(data?.orders);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) {
      getUserOrders();
    }
  }, [auth?.token]);
  return (
    <Layout>
      <div className="container-flui p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>

            {orders?.map((o, i) => {
              return (
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{i + 1}</th>
                        <th>{o?.status}</th>
                        <th>{o?.buyer?.name}</th>

                        <th>{moment(o?.createdAt).fromNow()}</th>
                        <th>{o?.payment?.success ? "Success" : "Failed"}</th>
                        <th>{o?.products?.length}</th>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.products?.map((p, i) => (
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
