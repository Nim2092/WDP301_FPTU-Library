import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResults from "../../components/SearchResult";
import AdvancedBookForm from "../../components/AdvancedSearchForm/index";

function AdvancedSearch() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="advanced-search container mt-5">
      <AdvancedBookForm setSearchResults={setSearchResults} />
      <SearchResults books={searchResults} />
    </div>
  );
}

export default AdvancedSearch;
