import React, { useEffect, useState } from "react";
import Layout from "../components/Layouts/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cart";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { toast } from "react-toastify";
import { AiOutlineReload } from "react-icons/ai";
import "./HomePage.css";
const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
    getTotal();
  });

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-products`
      );
      if (response.data.success) {
        setLoading(false);
        setProducts(response.data.products);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/product-count`
      );
      setTotal(data?.total);
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

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products_list]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) {
      return;
    } else {
      loadMore();
    }
    //eslint-disable-next-line
  }, [page]);

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
          <div className="col-md-3" style={{ padding: "5rem" }}>
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
            <h4 className="text-center mt-3">Filter By Price</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices.map((price) => (
                  <div key={price._id}>
                    <Radio value={price.array}>{price.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div>
              <button
                className="btn btn-danger mt-3"
                style={{ width: "75%", textAlign: "center" }}
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
            <div className="products-list" style={{ flexWrap: "nowrap" }}>
              {products?.map((p, i) => (
                <div
                  className="card m-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "stretch",
                  }}
                  key={i}
                >
                  <div>
                    <img
                      className="card-img-top"
                      src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${p._id}`}
                      alt="Card-cap"
                    />
                  </div>
                  <div className="card-body card-content">
                    <h4 className="card-title">{p.name}</h4>
                    <p className="card-text" style={{ fontSize: "1.6rem" }}>
                      {p.description.substring(0, 30)}
                    </p>
                    <p
                      className="card-text"
                      style={{
                        fontSize: "1.4rem",
                        color: "green",
                        alignSelf: "start",
                      }}
                    >
                      <strong>Rs. {p.price}</strong>
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.2rem",
                      }}
                    >
                      <button
                        className="btn btn-primary"
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
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details-&gt;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              {products && products.length < total && (
                <button
                  className="btn-load"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? (
                    "Loading ..."
                  ) : (
                    <>
                      {" "}
                      <span>Load More</span> <AiOutlineReload />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default HomePage;
