import React, { useState, useEffect } from "react";
import Layout from "../components/Layouts/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [similar_products, setSimilarProducts] = useState([]);

  const getProductDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-product/${params.slug}`
      );
      if (data.success) {
        setProduct(data.product);
        getSimilarProducts(data.product._id, data.product.category._id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/similar-product/${pid}/${cid}`
      );
      if (data.success) {
        setSimilarProducts(data.similar_products);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (params?.slug) {
      getProductDetails();
    }
  });
  return (
    <Layout>
      <div className="row container mt-4">
        <div className="col-md-6">
          <img
            className="card-img-top"
            src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`}
            alt="Card-cap"
          />
        </div>
        <div className="col-md-6 text-center">
          <h1>Product Details</h1>
          <h4>Name: {product.name}</h4>
          <h4>Description: {product.description}</h4>
          <h4>Price: {product.price}</h4>
          <h4>Category: {product.category?.name}</h4>
          <button className="btn btn-primary">ADD TO CART</button>
        </div>
      </div>
      <div className="row">
        <h1>Similar Products</h1>
        <h6>{similar_products.length < 1 && "No similar products found!"}</h6>
        <div className="d-flex">
          {similar_products?.map((p) => (
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
                <p className="card-text">{p.description.substring(0, 30)}</p>
                <p className="card-text">Rs. {p.price}</p>
                <button className="btn btn-primary ms-1">Add to Cart</button>
                {/* <button
                  className="btn btn-outline-secondary ms-1"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
