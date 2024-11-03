import "./Bookdetail.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
function BookDetail() {
  const { id } = useParams();
  const [bookSet, setBookSet] = useState(null);
  const [books, setBooks] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      const response = await axios.get(`http://localhost:9999/api/book-sets/${id}`);
      setBookSet(response.data.bookSet);
      setBooks(response.data.books);
      const image = response.data.bookSet.image;
      if (image) {
        setImage(`http://localhost:9999/api/book-sets/image/${image.split("/").pop()}`);
      }
    }
   
    fetchBookDetail();
  }, []);

  return (
    <div className="container">
      <h1>Book Detail</h1>
      {bookSet && (
        <div className="row">
          <div className="col-md-3">
            <img src={image} alt={bookSet.title} style={{ width: '200px' }} />
          </div>
          <div className="col-md-9">
            <h2>{bookSet.title}</h2>
            <p><strong>Author:</strong> {bookSet.author}</p>
            <p><strong>Published Year:</strong> {new Date(bookSet.publishedYear).getFullYear()}</p>
            <p><strong>Publisher:</strong> {bookSet.publisher}</p>
            <p><strong>ISBN:</strong> {bookSet.isbn}</p>
            <p><strong>Price:</strong> {bookSet.price} VND</p>
            <p><strong>Total Copies:</strong> {bookSet.totalCopies}</p>
            <p><strong>Available Copies:</strong> {bookSet.availableCopies}</p>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h3>Book Copies</h3>
            </div>
            <div className="col-md-6">
              <button className="btn btn-primary">Add new copy</button>
            </div>
          </div>
          <div className="col-md-12">
           <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Identifier Code</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Condition Detail</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book, index) => (
                  <tr key={book._id}>
                    <td>{index + 1}</td>
                    <td>{book.identifier_code}</td>
                    <td>{book.status}</td>
                    <td>{book.condition}</td>
                    <td>{book.conditionDetail || 'N/A'}</td>
                    <td>
                      <button className="btn btn-primary">Sửa</button>
                      <button className="btn btn-danger">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No book copies available</td>
                </tr>
              )}
            </tbody>
           </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
