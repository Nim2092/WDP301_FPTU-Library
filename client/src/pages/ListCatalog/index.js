import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const CatalogList = () => {
  const navigate = useNavigate();
  const [catalogData, setCatalogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCatalogId, setCurrentCatalogId] = useState(null);
  const [newCatalog, setNewCatalog] = useState({
    name: "",
    code: "",
    major: "",
    semester: "",
    isTextbook: ""
  });

  // Trạng thái cho các bộ lọc
  const [filters, setFilters] = useState({
    major: "",
    isTextbook: "",
    semester: ""
  });

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/catalogs/list");
        if (!response.ok) throw new Error("Failed to fetch catalog data");
        const data = await response.json();
        setCatalogData(data);
        setFilteredData(data); // Thiết lập dữ liệu lọc ban đầu
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  // Cập nhật dữ liệu lọc khi thay đổi bộ lọc
  useEffect(() => {
    const filtered = catalogData.filter((catalog) =>
      Object.entries(filters).every(([key, value]) =>
        value === "" || catalog[key].toString() === value
      )
    );
    setFilteredData(filtered);
  }, [filters, catalogData]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Xử lý mở modal cập nhật
  const handleUpdate = (id) => {
    const catalogToUpdate = catalogData.find((catalog) => catalog._id === id);
    setNewCatalog({
      name: catalogToUpdate.name,
      code: catalogToUpdate.code,
      major: catalogToUpdate.major,
      semester: catalogToUpdate.semester,
      isTextbook: catalogToUpdate.isTextbook
    });
    setCurrentCatalogId(id);
    setIsEditMode(true);
    setShowModal(true);
  };

  // Xử lý xóa catalog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this catalog?");
    
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:9999/api/catalogs/delete/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) throw new Error(`Failed to delete catalog: ${response.statusText}`);
  
        setCatalogData((prevCatalogs) => prevCatalogs.filter((catalog) => catalog._id !== id));
      } catch (error) {
        console.error("Error deleting catalog:", error);
      }
    }
  };

  // Mở modal tạo catalog mới
  const handleCreateNewCatalog = () => {
    setNewCatalog({ name: "", code: "", major: "", semester: "", isTextbook: false });
    setIsEditMode(false);
    setShowModal(true);
  };

  // Gửi dữ liệu form (tạo mới hoặc cập nhật)
  const handleSubmitCatalog = async (e) => {
    e.preventDefault();

    const endpoint = isEditMode
      ? `http://localhost:9999/api/catalogs/update/${currentCatalogId}`
      : "http://localhost:9999/api/catalogs/create";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCatalog),
      });

      if (!response.ok) throw new Error(`Failed to ${isEditMode ? "update" : "create"} catalog`);

      const savedCatalog = await response.json();

      if (isEditMode) {
        setCatalogData((prevData) =>
          prevData.map((catalog) =>
            catalog._id === currentCatalogId ? savedCatalog : catalog
          )
        );
      } else {
        setCatalogData([...catalogData, savedCatalog]);
      }

      setShowModal(false);
      setNewCatalog({ name: "", code: "", major: "", semester: "", isTextbook: false });
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} catalog:`, error);
    }
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCatalog((prevCatalog) => ({
      ...prevCatalog,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>Catalog</h2>
        <button className="btn btn-primary" onClick={handleCreateNewCatalog}>
          Create new catalog
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="d-flex justify-content-between my-3">
        <select
          name="major"
          value={filters.major}
          onChange={handleFilterChange}
          className="form-select mx-1"
        >
          <option value="">All Majors</option>
          {[...new Set(catalogData.map((c) => c.major))].map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>

        <select
          name="isTextbook"
          value={filters.isTextbook}
          onChange={handleFilterChange}
          className="form-select mx-1"
        >
          <option value="">All Types</option>
          <option value="1">Textbook</option>
          <option value="0">Non-Textbook</option>
        </select>

        <select
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="form-select mx-1"
        >
          <option value="">All Semesters</option>
          {[...new Set(catalogData.map((c) => c.semester))].map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading catalogs...</div>
      ) : (
        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name of catalog</th>
              <th>Code</th>
              <th>Major</th>
              <th>Semester</th>
              <th>Is Textbook</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((catalog, index) => (
                <tr key={catalog._id}>
                  <td>{index + 1}</td>
                  <td>{catalog.name}</td>
                  <td>{catalog.code}</td>
                  <td>{catalog.major}</td>
                  <td>{catalog.semester}</td>
                  <td>{catalog.isTextbook ? "Yes" : "No"}</td>
                  <td className="d-flex justify-content-between">
                    <button className="btn btn-success mr-2" onClick={() => handleUpdate(catalog._id)}>
                      Update
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(catalog._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No catalogs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal for creating or updating catalog */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Update Catalog" : "Create New Catalog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitCatalog}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newCatalog.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="code">Code</label>
              <input
                type="number"
                className="form-control"
                id="code"
                name="code"
                value={newCatalog.code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="major">Major</label>
              <input
                type="text"
                className="form-control"
                id="major"
                name="major"
                value={newCatalog.major}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="semester">Semester</label>
              <input
                type="number"
                className="form-control"
                id="semester"
                name="semester"
                value={newCatalog.semester}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group" style={{ display: "flex", alignItems: "center",  margin: "10px"}}>
              <label htmlFor="isTextbook" style={{ marginRight: "10px" }}>Is Textbook</label>
              <input
                type="checkbox"
                id="isTextbook"
                name="isTextbook"
                checked={newCatalog.isTextbook === 1}
                onChange={handleInputChange}
              />
            </div>
            <Button variant="primary" type="submit">
              {isEditMode ? "Update Catalog" : "Save Catalog"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CatalogList;
