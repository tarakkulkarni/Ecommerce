import React, { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cart";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { toast } from "react-toastify";
const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useCart();
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-categories`
      );
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategories();
  });

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
    }
  };
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) {
      getAllProducts();
    }
  }, [checked.length, radio.length]);
  useEffect(() => {
    if (checked.length || radio.length) {
      getFilteredProducts();
    }
  });
  const getFilteredProducts = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/products/filter-products`,
        { checked, radio }
      );
      if (response.data.success) {
        setProducts(response.data.filtered_products);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <h4 className="text-center">Filter By Category</h4>
            <div className="d-flex flex-column">
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => {
                    handleFilter(e.target.checked, c._id);
                  }}
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>
            <h4 className="text-center">Filter by Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices.map((price) => (
                  <div key={price._id}>
                    <Radio value={price.array}>{price.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="d-flex flex-column">
              <button
                className="btn btn-danger"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Clear Filter
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products</h1>
            <div className="d-flex">
              {products?.map((p, i) => (
                <div className="card m-3" style={{ width: "18rem" }} key={i}>
                  <img
                    className="card-img-top"
                    src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${p._id}`}
                    alt="Card-cap"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}
                    </p>
                    <p className="card-text">Rs. {p.price}</p>
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Product added to cart!");
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-secondary ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default HomePage;
