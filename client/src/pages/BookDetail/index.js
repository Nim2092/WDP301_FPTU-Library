import { Modal, Button } from "react-bootstrap";
import "./Bookdetail.scss";
import { useState } from "react";
function BookDetail() {
  const [showModal, setShowModal] = useState(false); 

  const book = {
    title: "Python for Beginner",
    author: "Nguyen Ngoc Tan",
    isbn: "9786044749464",
    publication: "Updating",
    ratingCode: "005.133",
    publisher: "Dan Tri",
    year: "2023",
    physicalDescription: "196 pages: illustrations; 27 cm",
  };

  const borrowingInfo = {
    totalCopies: 1,
    idleCopies: 1,
    busyCopies: 0,
  };

  const handleModalOpen = () => setShowModal(true); // Mở modal
  const handleModalClose = () => setShowModal(false); // Đóng modal
  return (
    <div className="book-detail container my-5">
      <h2>Book Detail</h2>
      <div className="row">
        {/* Hình ảnh sách */}
        <div className="col-md-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Book cover"
            className="img-fluid"
          />
        </div>

        {/* Thông tin sách */}
        <div className="col-md-8">
          <h3>{book.title}</h3>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <hr className="text-danger" />
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>
                  <strong>ISBN</strong>
                </td>
                <td>{book.isbn}</td>
              </tr>
              <tr>
                <td>
                  <strong>Publication</strong>
                </td>
                <td>{book.publication}</td>
              </tr>
              <tr>
                <td>
                  <strong>Rating code</strong>
                </td>
                <td>{book.ratingCode}</td>
              </tr>
              <tr>
                <td>
                  <strong>Publisher</strong>
                </td>
                <td>{book.publisher}</td>
              </tr>
              <tr>
                <td>
                  <strong>Publishing year</strong>
                </td>
                <td>{book.year}</td>
              </tr>
              <tr>
                <td>
                  <strong>Physical description</strong>
                </td>
                <td>{book.physicalDescription}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Phần đăng ký mượn sách */}
      <hr className="text-danger" />
      <h4>Register to borrow</h4>
      <p>
        FGW CT: TK/CTIT Total: {borrowingInfo.totalCopies} Idle:{" "}
        {borrowingInfo.idleCopies} Busy:{" "}
        <span className="text-danger">{borrowingInfo.busyCopies}</span>
      </p>
      <p>
        Total copies: <strong>{borrowingInfo.totalCopies}</strong>{" "}
        <span
          className="text-primary"
          onClick={handleModalOpen}
          style={{ cursor: "pointer" }}
        >
          Details
        </span>
      </p>
      <p>Idle copies: {borrowingInfo.idleCopies}</p>
      <p>
        Number of readers currently borrowing: {borrowingInfo.busyCopies}{" "}
        <a href="/borrowing" className="text-primary">
          Borrowing books
        </a>
      </p>

      {/* Modal hiển thị khi nhấn "Details" */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết tình trạng sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Thư viện</th>
                <th>Kho</th>
                <th>ĐKCB</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FSC12 DN</td>
                <td>TK/12DN</td>
                <td>TK/12DN000133</td>
                <td className="text-success">Đang sẵn sàng</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookDetail;
