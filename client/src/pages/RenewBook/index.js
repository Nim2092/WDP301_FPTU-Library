import React, { useState } from "react";
import "./RenewBook.scss"; // Nếu bạn có file CSS để tạo kiểu

function RenewBook() {
  // Giả lập dữ liệu sách
  const book = {
    title: "Python for Beginner",
    author: "Nguyen Ngoc Tan",
    orderDate: "10/09/2024",
    dueDate: "15/09/2024",
  };

  const [newDueDate, setNewDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi yêu cầu gia hạn sách tại đây
    console.log("Submitting new due date:", newDueDate);
  };

  return (
    <div className="renew-book container my-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src="https://via.placeholder.com/150" // Thay thế bằng hình ảnh thực tế
            alt="Book cover"
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          <h3>{book.title}</h3>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Order date:</strong> {book.orderDate}</p>
          <p><strong>Due date:</strong> {book.dueDate}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newDueDate" className="form-label">
                New due date
              </label>
              <input
                type="date"
                className="form-control"
                id="newDueDate"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-danger">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RenewBook;
