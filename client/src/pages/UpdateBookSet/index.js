import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // To get the ID from the URL and navigate after submission
import { json } from "react-router-dom";
const UpdateBookSet = () => {
  const { id } = useParams(); // Get the book set ID from the URL
  const navigate = useNavigate(); // To navigate after successful update
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedYear: "",
    isbn: "",
    publisher: "",
    shelfLocationCode: "",
    totalCopies: "",
    availableCopies: "",
    catalog: "", // String representing catalog ID
    keywords: "",
    subject: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch the existing book set data on component mount
  useEffect(() => {
    const fetchBookSet = async () => {
      try {
        const response = await fetch(
          `http://localhost:9999/api/book-sets/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book set details.");
        }
        const data = await response.json();

        // Format date to YYYY-MM-DD
        const formatDateToYMD = (date) => {
          const d = new Date(date);
          if (isNaN(d)) return ""; // Return an empty string if date is invalid
          const year = d.getFullYear();
          const month = `0${d.getMonth() + 1}`.slice(-2); // Add leading zero if needed
          const day = `0${d.getDate()}`.slice(-2); // Add leading zero if needed
          return `${year}-${month}-${day}`;
        };
        const catalogCode = data.bookSet.catalog_id?.code || "";
        // Set the form data with values from the fetched data
        setFormData({
          title: data.bookSet.title || "",
          author: data.bookSet.author || "",
          publishedYear: data.bookSet.publishedYear
            ? formatDateToYMD(data.bookSet.publishedYear)
            : "",
          isbn: data.bookSet.isbn || "",
          publisher: data.bookSet.publisher || "",
          shelfLocationCode: data.bookSet.shelfLocationCode || "",
          totalCopies: data.bookSet.totalCopies || "",
          availableCopies: data.bookSet.availableCopies || "",
          catalog: catalogCode,
          keywords: data.bookSet.keywords || "",
          subject: data.bookSet.subject || "",
        });
        console.log(data.bookSet);
        setIsLoading(false); // Set loading to false once data is loaded
      } catch (error) {
        setErrorMessage(error.message);
        console.error("Error fetching book set:", error);
        setIsLoading(false);
      }
    };

    fetchBookSet();
  }, [id]);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `http://localhost:9999/api/book-sets/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send the updated form data as JSON
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update book set. Please try again.");
      }

      const result = await response.json();
      setSuccessMessage("Book set updated successfully!");
      console.log("API Response:", result);

      // Navigate to the list page or any other route after success
      navigate("/book-sets");
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error updating book set:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        Loading book set details...
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Update Book Set</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Image Upload Section */}
          <div className="col-md-3">
            <div className="form-group">
              {image ? (
                <img src={image} alt="Selected" className="img-thumbnail" />
              ) : (
                <div
                  className="img-thumbnail d-flex justify-content-center align-items-center"
                  style={{
                    height: "200px",
                    width: "100%",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  Add img
                </div>
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="col-md-9">
            <div className="form-group">
              <label htmlFor="title">Name</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                className="form-control"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Row with 2 Columns */}
            <div className="row">
              <div className="form-group mt-3 col-md-6">
                <label htmlFor="publishedYear">Publication date</label>
                <input
                  type="date"
                  className="form-control"
                  id="publishedYear"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mt-3 col-md-6">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  className="form-control"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                  required
                />
              </div>
            </div>

            {/* Row with 2 Columns */}
            <div className="row">
              <div className="form-group mt-3 col-md-6">
                <label htmlFor="shelfLocationCode">Book sorting code</label>
                <input
                  type="text"
                  className="form-control"
                  id="shelfLocationCode"
                  name="shelfLocationCode"
                  value={formData.shelfLocationCode}
                  onChange={handleChange}
                  placeholder="Enter book sorting code"
                  required
                />
              </div>
              <div className="form-group mt-3 col-md-6">
                <label htmlFor="publisher">Publisher</label>
                <input
                  type="text"
                  className="form-control"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="Enter publisher"
                  required
                />
              </div>
            </div>

            {/* Row with 2 Columns */}
            <div className="row">
              <div className="form-group mt-3 col-md-6">
                <label htmlFor="totalCopies">Total Copies</label>
                <input
                  type="number"
                  className="form-control"
                  id="totalCopies"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  placeholder="Enter total copies"
                  required
                />
              </div>
              <div className="form-group mt-3 col-md-6">
                <label htmlFor="availableCopies">Available Copies</label>
                <input
                  type="number"
                  className="form-control"
                  id="availableCopies"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  placeholder="Enter available copies"
                  required
                />
              </div>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="catalog_id">Catalog</label>
              <input
                type="text"
                className="form-control"
                id="catalog_id"
                name="catalog"
                value={formData.catalog}
                onChange={handleChange}
                placeholder="Enter catalog ID"
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="keywords">Keywords</label>
              <input
                type="text"
                className="form-control"
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="Enter keywords"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
            </div>
          </div>
        </div>

        {/* Feedback and Save Button */}
        <div className="d-flex justify-content-center mt-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
        {errorMessage && (
          <p className="text-danger text-center mt-3">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-success text-center mt-3">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default UpdateBookSet;
