import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchInput = () => {
  const [values, setValues] = useSearch("");
  const navigate = useNavigate();
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        style={{
          display: "flex",
          gap: "1.4rem",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={handleSearchSubmit}
      >
        <input
          className="form-control "
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          style={{ fontSize: "1.8rem" }}
        />
        <button
          className="btn btn-outline-success "
          type="submit"
          style={{ fontSize: "1.6rem" }}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
