import React, { useState } from "react";

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // You can add your search API call or logic here
  };

  return (
    <div className="search-container" style={styles.container}>
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            style={styles.input}
            placeholder="Enter name or code of book"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary" style={styles.button}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#d3d3d3',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '50px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default BookSearch;
