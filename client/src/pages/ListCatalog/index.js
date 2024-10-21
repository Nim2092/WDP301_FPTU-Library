import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const CatalogList = () => {
  const navigate = useNavigate();
  const [catalogData, setCatalogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Control the visibility of the modal
  const [isEditMode, setIsEditMode] = useState(false); // Track whether it's edit mode
  const [currentCatalogId, setCurrentCatalogId] = useState(null); // Track the catalog being edited
  const [newCatalog, setNewCatalog] = useState({
    name: "",
    code: "",
    major: "",
    semester: "",
    isTextbook: ""
  });

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/catalogs/list");
        if (!response.ok) {
          throw new Error("Failed to fetch catalog data");
        }
        const data = await response.json();
        setCatalogData(data);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  // Handle Update (open modal with catalog data pre-filled)
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
    setIsEditMode(true); // Set edit mode
    setShowModal(true); // Open the modal
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this catalog?");
    
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:9999/api/catalogs/delete/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error(`Failed to delete catalog: ${response.statusText}`);
        }
  
        console.log(`Catalog with ID: ${id} has been deleted`);
  
        // Update state by filtering out the deleted catalog
        setCatalogData((prevCatalogs) => prevCatalogs.filter((catalog) => catalog._id !== id));
        
      } catch (error) {
        console.error("Error deleting catalog:", error);
      }
    }
  };

  // Open the Create Catalog Modal
  const handleCreateNewCatalog = () => {
    setNewCatalog({ name: "", code: "", major: "", semester: "", isTextbook: false }); // Clear the form
    setIsEditMode(false); // Set create mode
    setShowModal(true); // Show modal
  };

  // Handle Form Submit for new or updated catalog
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

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} catalog`);
      }

      const savedCatalog = await response.json();

      if (isEditMode) {
        // Update the catalog in the catalog list
        setCatalogData((prevData) =>
          prevData.map((catalog) =>
            catalog._id === currentCatalogId ? savedCatalog : catalog
          )
        );
      } else {
        // Add the new catalog to the list
        setCatalogData([...catalogData, savedCatalog]);
      }

      setShowModal(false); // Close modal after submission
      setNewCatalog({ name: "", code: "", major: "", semester: "", isTextbook: false }); // Reset form
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} catalog:`, error);
    }
  };

  // Handle input change for the catalog form
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
            {catalogData.length > 0 ? (
              catalogData.map((catalog, index) => (
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
                <td colSpan="6" className="text-center">
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
                checked={newCatalog.isTextbook === 1} // Check the box if isTextbook is 1
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
