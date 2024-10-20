import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResults from "../../components/SearchResult";
import AdvancedBookForm from "../../components/AdvancedSearchForm/index";

function AdvancedSearch() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="advanced-search">
      <AdvancedBookForm setSearchResults={setSearchResults} />
      <SearchResults books={searchResults} />
    </div>
  );
}

export default AdvancedSearch;
