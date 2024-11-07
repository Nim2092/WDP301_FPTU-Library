import React from "react";
import SearchResults from "../../components/SearchResult";
import Search from "../../components/Search";
import { useState } from "react";

function SearchResultsPage() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="container">
      <Search setSearchResults={setSearchResults} />
      <SearchResults books={searchResults} />
    </div>
  );
}

export default SearchResultsPage;
