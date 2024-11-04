import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const UpdateBookSet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentCatalogName, setCurrentCatalogName] = useState("");
  const [catalogData, setCatalogData] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    catalog_id: "",
    isbn: "",
    code: "",
    shelfLocationCode: "",
    title: "",
    author: "",
    publishedYear: "",
    publisher: "",
    physicalDescription: "",
    totalCopies: "",
    availableCopies: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get("https://fptu-library.xyz/api/catalogs/list");
        setCatalogData(response.data);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    const fetchBookSet = async () => {
      try {
        const response = await axios.get(`https://fptu-library.xyz/api/book-sets/${id}`);
        const bookSetData = response.data.bookSet;
        setFormData({
          catalog_id: bookSetData.catalog_id._id,
          isbn: bookSetData.isbn,
          code: bookSetData.code,
          shelfLocationCode: bookSetData.shelfLocationCode,
          title: bookSetData.title,
          author: bookSetData.author,
          publishedYear: bookSetData.publishedYear.split('T')[0],
          publisher: bookSetData.publisher,
          physicalDescription: bookSetData.physicalDescription,
          totalCopies: bookSetData.totalCopies,
          availableCopies: bookSetData.availableCopies,
          price: bookSetData.price,
          image: bookSetData.image,
        });
        if (bookSetData.image) {
          setImagePreview(`https://fptu-library.xyz/api/book-sets/image/${bookSetData.image.split("/").pop()}`);
        }
      } catch (error) {
        console.error("Error fetching book set data:", error);
      }
    };
    fetchBookSet();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await axios.put(
        `https://fptu-library.xyz/api/book-sets/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/list-book-set");
      }, 1000);
    } catch (error) {
      console.error("Error updating book set:", error);
      toast.error("Failed to update book set");
    }
  };


  return (
    <div className="container">
      <ToastContainer />
      <h1 className="my-4 text-center">Update Book Set</h1>
      <form onSubmit={handleSubmit}>
        {/* Image Preview */}
        <div className="row">
          <div className="col-md-3">
            {imagePreview && (
              <img src={imagePreview}
                alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            )}
            <input type="file" className="form-control mt-3" style={{ width: "80%" }} onChange={handleImageChange} />
          </div>

          <div className="col-md-9">
            <div className="row">
              <div className="col-md-6">
                {/* Catalog Selection */}
                <div className="mb-3">
                  <label htmlFor="catalog_id" className="form-label">Catalog:</label>
                  <select className="form-select" name="catalog_id" value={formData.catalog_id} onChange={handleInputChange}>
                    <option value="">{currentCatalogName || "Select Catalog"}</option>
                    {catalogData.map((catalog) => (
                      <option key={catalog._id} value={catalog._id}>{catalog.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Form Fields */}
              {[
                { label: "ISBN", id: "isbn", type: "text" },
                { label: "Price", id: "price", type: "number" },
                { label: "Code", id: "code", type: "text" },
                { label: "Title", id: "title", type: "text" },
                { label: "Author", id: "author", type: "text" },
                { label: "Published Year", id: "publishedYear", type: "date" },
                { label: "Publisher", id: "publisher", type: "text" },
                { label: "Physical Description", id: "physicalDescription", type: "text" },
                { label: "Shelf Location Code", id: "shelfLocationCode", type: "text" },
                { label: "Total Copies", id: "totalCopies", type: "number" },
                { label: "Available Copies", id: "availableCopies", type: "number" },
              ].map(({ label, id, type }) => (
                <div className="mb-3 col-md-6" key={id}>
                  <label htmlFor={id} className="form-label">{label}:</label>
                  <input
                    type={type}
                    className="form-control"
                    id={id}
                    name={id}
                    value={formData[id] || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary mb-3 d-flex">Update Book Set</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBookSet;
