import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function BookSetDetail() {
  const { bookId } = useParams(); // Lấy bookSetId từ URL
  const navigate = useNavigate(); // Dùng để điều hướng đến trang mượn sách
  const [bookSet, setBookSet] = useState(null); // Lưu trữ thông tin bộ sách
  const [books, setBooks] = useState([]); // Lưu trữ danh sách các quyển sách

  // Lấy dữ liệu chi tiết của bộ sách từ API
  useEffect(() => {
    const fetchBookSetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/book-sets/${bookId}`);
        setBookSet(response.data.bookSet); // Lưu thông tin bộ sách
        setBooks(response.data.books); // Lưu danh sách các quyển sách
      } catch (error) {
        console.error("Error fetching book set details:", error);
      }
    };

    fetchBookSetDetails();
  }, [bookId]);

  // Hàm xử lý khi người dùng nhấn "Borrow this book"
  const handleBorrowClick = () => {
    if (books.length > 0) {
      const firstBook = books[0]; // Lấy quyển sách đầu tiên trong danh sách
      navigate(`/order/${firstBook._id}`); // Điều hướng đến trang mượn sách với bookId
    }
  };

  return (
    <div className="container my-5">
      {bookSet ? (
        <>
          {/* Hiển thị thông tin bộ sách */}
          <h3>{bookSet.title}</h3>
          <p><strong>Author:</strong> {bookSet.author}</p>
          <p><strong>Publisher:</strong> {bookSet.publisher}</p>
          <p><strong>Published Year:</strong> {new Date(bookSet.publishedYear).getFullYear()}</p>
          <p><strong>Physical Description:</strong> {bookSet.physicalDescription}</p>
          <p><strong>Total Copies:</strong> {bookSet.totalCopies}</p>
          <p><strong>Available Copies:</strong> {bookSet.availableCopies}</p>

          {/* Hiển thị danh sách các quyển sách */}
          <h4>Books in this set:</h4>
          {books.length > 0 ? (
            <ul className="list-group">
              {books.map((book, index) => (
                <li key={book._id} className="list-group-item">
                  <p><strong>Book Identifier Code:</strong> {book.identifier_code}</p>
                  <p><strong>Condition:</strong> {book.condition}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No books available.</p>
          )}

          {/* Nút mượn quyển sách đầu tiên */}
          {books.length > 0 && (
            <button className="btn btn-primary mt-3" onClick={handleBorrowClick}>
              Borrow this book
            </button>
          )}
        </>
      ) : (
        <p>Loading book set details...</p>
      )}
    </div>
  );
}

export default BookSetDetail;
