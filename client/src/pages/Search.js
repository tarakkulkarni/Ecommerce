import React from "react";
import Layout from "../components/Layouts/Layout";
import { useSearch } from "../context/search";

const Search = () => {
  const [values, setValues] = useSearch();
  return (
    <Layout>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No products found"
              : `Found ${values?.results.length} product(s)`}
          </h6>
          <div className="d-flex">
            {values?.results.map((p) => (
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
                  <button className="btn btn-outline-secondary ms-1">
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
