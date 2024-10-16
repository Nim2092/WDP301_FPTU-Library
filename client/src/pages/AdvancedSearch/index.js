import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchResults from "../../components/SearchResult";
import AdvancedSearchForm from "../../components/AdvancedSearchForm";
function AdvancedSearch() {
  return (
    <div className="advanced-search">
      <AdvancedSearchForm />
      <SearchResults />
    </div>
  );
}

export default AdvancedSearch;
