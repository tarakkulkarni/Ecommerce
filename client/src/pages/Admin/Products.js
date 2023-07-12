import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Products = () => {
  const [products, setProducts] = useState([]);
  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-products`
      );
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  useEffect(() => {
    getAllProducts();
  });
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products</h1>

            <div className="d-flex">
              {products?.map((p) => (
                <Link
                  to={`/dashboard/admin/product/${p.slug}`}
                  key={p._id}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card m-3" style={{ width: "18rem" }}>
                    <img
                      className="card-img-top"
                      src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${p._id}`}
                      alt="Card-cap"
                      height={300}
                      width={300}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
