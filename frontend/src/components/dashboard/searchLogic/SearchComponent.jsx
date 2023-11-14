import React, { useState, useEffect, useRef } from "react";
import { useUserSearch } from "./../../graphqlOperations/userClient";

import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchResult from "./SearchResult";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { executeSearch, searchData } = useUserSearch();
  const searchComponentRef = useRef();

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const delayDebounce = setTimeout(() => {
        executeSearch({ variables: { searchTerm: searchTerm.trim() } });
      }, 300);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, executeSearch]);

  const handleClickOutside = (event) => {
    if (
      searchComponentRef.current &&
      !searchComponentRef.current.contains(event.target)
    ) {
      setSearchTerm("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const listStyles = {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    backgroundColor: "white",
    padding: "10px",
    border: "1px solid #ddd",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    maxHeight: "300px",
    overflowY: "auto",
  };

  return (
    <Box position="relative" ref={searchComponentRef}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm.trim() && (
        <div style={listStyles}>
          <List>
            {searchData && searchData.searchUser.length > 0 ? (
              searchData.searchUser.map((user, index) => (
                <SearchResult key={index} user={user} />
              ))
            ) : (
              <Typography variant="subtitle1">No results found</Typography>
            )}
          </List>
        </div>
      )}
    </Box>
  );
};

export default SearchComponent;
