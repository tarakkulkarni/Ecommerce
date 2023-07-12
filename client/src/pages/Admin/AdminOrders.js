import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import moment from "moment";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
const { Option } = Select;
const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);

  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getAdminOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/orders/admin-orders`
      );
      setOrders(data?.orders);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) {
      getAdminOrders();
    }
  }, [auth?.token]);
  const handleUpdateStatus = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/orders/order-status/${orderId}`,
        { status: value }
      );
      getAdminOrders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
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
                      <th>
                        <Select
                          bordered={false}
                          onChange={(value) => handleUpdateStatus(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </th>
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
    </Layout>
  );
};

export default AdminOrders;
