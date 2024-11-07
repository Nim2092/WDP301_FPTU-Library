import React from "react";
import SearchResults from "../../components/SearchResult";
import Search from "../../components/Search";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function SearchResultsPage() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState(location.state?.results || []);

  return (
    <div>
      <Search setSearchResults={setSearchResults} />
      <SearchResults books={searchResults} />
    </div>
  );
}

export default SearchResultsPage;
