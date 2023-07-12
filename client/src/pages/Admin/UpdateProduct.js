import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layouts/Layout";
import AdminMenu from "../../components/Layouts/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { Select } from "antd";

const UpdateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const getSingleProduct = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/products/get-product/${params.slug}`
    );
    if (data.success) {
      setProductName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
    }
  };
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
      toast.error("Error in getting categories");
    }
  };
  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    getAllCategories();
  }, []);
  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", productName);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/products/update-product/${id}`,
        productData
      );
      if (response.data.success) {
        navigate("/dashboard/admin/products");
        toast.success("Product updated successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const handleProductDelete = async () => {
    try {
      let confirm = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirm) return;
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/products/delete-product/${id}`
      );
      if (response.data.success) {
        navigate("/dashboard/admin/products");
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const { Option } = Select;
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product Details</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(v) => setCategory(v)}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="images/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
                <div className="mb-3">
                  {photo ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product_photo"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${id}`}
                        alt="product_photo"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={productName}
                    placeholder="Enter product name"
                    className="form-control"
                    onChange={(e) => {
                      setProductName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    type="text"
                    value={description}
                    placeholder="Enter product description"
                    className="form-control"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    value={price}
                    placeholder="Enter product price"
                    className="form-control"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    value={quantity}
                    placeholder="Enter product quantity"
                    className="form-control"
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <Select
                    bordered={false}
                    placeholder="Shipping detais"
                    size="large"
                    showSearch
                    className="form-select mb-3"
                    onChange={(v) => setShipping(v)}
                    value={shipping ? "Yes" : "No"}
                  >
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                  </Select>
                </div>
                <div className="d-flex">
                  <div className="mb-3 ms-1">
                    <button
                      type="submit"
                      className="btn btn-outline-primary"
                      onClick={handleProductUpdate}
                    >
                      Update Product
                    </button>
                  </div>
                  <div className="mb-3 ms-1">
                    <button
                      type="submit"
                      className="btn btn-outline-danger"
                      onClick={handleProductDelete}
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
