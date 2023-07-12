import React from "react";
import { useContext, createContext, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    keyword: null,
    results: [],
  });
  //default axios

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};
//custom hook
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
