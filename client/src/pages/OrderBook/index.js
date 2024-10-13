import React, { useState } from "react";
import "./OrderBook.scss"; // Nếu bạn có file CSS để tạo kiểu

function Order() {
  // Giả lập dữ liệu sách
  const book = {
    title: "Python for Beginner",
    author: "Nguyen Ngoc Tan",
    isbn: "9786044749494",
    publication: "Updating",
    ratingCode: "005.133",
    publisher: "Dan Tri",
    year: "2023",
    physicalDescription: "196 pages: illustrations; 27 cm",
  };

  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi yêu cầu đặt sách tại đây
    console.log("Order submitted with borrow date:", borrowDate, "and return date:", returnDate);
  };

  return (
    <div className="order container my-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src="https://via.placeholder.com/150" 
            alt="Book cover"
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          <h3>{book.title}</h3>
          <table className="table table-borderless">
            <tbody>
                <tr>
                    <td><strong>Author</strong></td>
                    <td>{book.author}</td>
                </tr>
              <tr>
                <td><strong>ISBN</strong></td>
                <td>{book.isbn}</td>
              </tr>
              <tr>
                <td><strong>Publication</strong></td>
                <td>{book.publication}</td>
              </tr>
              <tr>
                <td><strong>Rating code</strong></td>
                <td>{book.ratingCode}</td>
              </tr>
              <tr>
                <td><strong>Publisher</strong></td>
                <td>{book.publisher}</td>
              </tr>
              <tr>
                <td><strong>Publishing year</strong></td>
                <td>{book.year}</td>
              </tr>
              <tr>
                <td><strong>Physical description</strong></td>
                <td>{book.physicalDescription}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="row mt-4">
        <div className="col-md-6 mb-3">
          <label htmlFor="borrowDate" className="form-label">Borrow date</label>
          <input
            type="date"
            className="form-control"
            id="borrowDate"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="returnDate" className="form-label">Return date</label>
          <input
            type="date"
            className="form-control"
            id="returnDate"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-12 d-flex justify-content-center">
          <button type="submit" className="btn btn-danger">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Order;
