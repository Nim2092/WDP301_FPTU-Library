import React, { useState, useEffect } from "react";
import axios from "axios"; // Use axios for API calls

const AdvancedBookForm = ({ setSearchResults }) => {
  const [catalog, setCatalog] = useState("");
  const [catalogData, setCatalogData] = useState([]);
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("https://fptu-library.xyz/api/book-sets/list", {
        params: {
          title: bookName,
          author,
          publisher: publisher,
          pubYear: publicationYear,
          catalog_id: catalog,
          isTextbook: subject,
        },
      });

      // Update search results with the response data
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching book sets", error);
    }
  };
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        if (subject === "1") {
          const response = await axios.get("https://fptu-library.xyz/api/catalogs/list", {
            params: {
              isTextbook: subject,
              semester: semester,
            },
          });
          setCatalogData(response.data.data);
        } else if (subject === "0") {
          const response = await axios.get("https://fptu-library.xyz/api/catalogs/list");
          setCatalogData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching catalog data:", error);
      }
    };
    fetchCatalogs();
  }, [subject, semester]);



  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2 shadow-sm p-3 mb-5 bg-body rounded">
          <div className="row">
            <div className="mb-3 col-md-4">
              <select
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form-control"
              >
                <option value="">Chọn môn học</option>
                <option value="0">Sách tham khảo</option>
                <option value="1">Sách giáo trình</option>
              </select>
            </div>
            <div className="mb-3 col-md-4">
              <select
                id="semester"
                name="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="form-control"
              >
                <option value="">Chọn học kỳ</option>
                {subject === "1" && (
                  <>
                    <option value="1">Học kỳ 1</option>
                    <option value="2">Học kỳ 2</option>
                    <option value="3">Học kỳ 3</option>
                    <option value="4">Học kỳ 4</option>
                    <option value="5">Học kỳ 5</option>
                    <option value="6">Học kỳ 6</option>
                    <option value="7">Học kỳ 7</option>
                    <option value="8">Học kỳ 8</option>
                    <option value="9">Học kỳ 9</option>
                  </>
                )}

              </select>
            </div>
            <div className="mb-3 col-md-4">
              <select
                id="catalog"
                name="catalog"
                value={catalog}
                onChange={(e) => setCatalog(e.target.value)}
                className="form-control"
              >
                <option value="">Chọn bộ sách</option>
                {subject === "1" && (
                  <>
                    {catalogData.map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </>
                )}
                {subject === "0" && (
                  <>
                    {catalogData.map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>
          <hr />
          <div>
            <div className="mb-3">
              <label htmlFor="book-name">Tên sách</label>
              <input
                type="text"
                id="book-name"
                name="book-name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="author">Tác giả</label>
              <input
                type="text"
                id="author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="publisher">Nhà xuất bản</label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="publication-year">Năm xuất bản</label>
                <input
                  type="date"
                  id="publication-year"
                  name="publication-year"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <hr />
          <button type="submit" className="btn btn-primary mt-3">
            Tìm kiếm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedBookForm;
