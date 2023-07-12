import React, { useState, useEffect } from "react";
import Layout from "../../components/Layouts/Layout";
import AdminMenu from "../../components/Layouts/AdminMenu";
import { toast } from "react-toastify";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        { name }
      );
      if (response.data.success) {
        toast.success("New Category created!");
        getAllCategories();
      }
    } catch (error) {
      console.log(error);
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
    getAllCategories();
    //eslint-disable-next-line
  }, []);
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (response.data.success) {
        toast.success("Category updated successfully");
        handleCancel();
        getAllCategories();
        setSelected(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteCategory = async (id) => {
    try {
      let confirm = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (!confirm) return;
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`
      );
      if (response.data.success) {
        toast.success("Category Deleted!");
        getAllCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <CategoryForm
              handleSubmit={handleCategorySubmit}
              value={name}
              setValue={setName}
            ></CategoryForm>
            <div className="w-75">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr>
                      <td key={c._id}>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            showModal();
                            setSelected(c);
                            setUpdatedName(c.name);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handleDeleteCategory(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              open={visible}
              footer={null}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdateCategory}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
