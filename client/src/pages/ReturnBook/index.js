import axios from "axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

function ReturnBook() {
    const [studentCode, setStudentCode] = useState("");
    const [identityCode, setIdentityCode] = useState("");
    const [checkIdentityCode, setCheckIdentityCode] = useState("");
    const [bookList, setBookList] = useState([]);
    const [bookData, setBookData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
    const [fineData, setFineData] = useState({ fine_reason: "" });
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [flag, setFlag] = useState(false);

    const handleSearchByStudentID = async () => {
        try {
            const user = await axios.get(`https://fptu-library.xyz/api/user/getByCode/${studentCode}`);
            const userID = user.data.data.userID;
            const response = await axios.get(`https://fptu-library.xyz/api/orders/by-user/${userID}`);
            const data = response.data.data;
            setBookList(Array.isArray(data) ? data : [data]);
            setFlag(false);
        } catch (error) {
            const message = error.response?.data?.message || "An error occurred";
            toast.error(message);
        }
    }

    const handleSearchByIdentityCode = async () => {
        try {
            const response = await axios.get(`https://fptu-library.xyz/api/orders/by-identifier-code/${identityCode}`);
            setBookList(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
            setFlag(true);
        } catch (error) {
            const message = error.response?.data?.message || "An error occurred";
            console.log(message);
            toast.error(message);
        }
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleReturnBook = (bookID) => {
        axios.get(`https://fptu-library.xyz/api/orders/by-order/${bookID}`).then((response) => {
            const { _id, book_id: book, borrowDate, dueDate, created_by, updated_by, condition, condition_detail } = response.data.data;
            setBookData({ _id, book, borrowDate, dueDate, created_by, updated_by, condition, condition_detail });
            setCheckIdentityCode(book.identifier_code);
            handleShowModal();
        }).catch((error) => {
            const message = error.response?.data?.message || "An error occurred";
            toast.error(message);
        });
    }

    const handleSubmit = () => {
        const payload = {
            userId: bookData.created_by?._id,
            returnDate: new Date(returnDate).toISOString(),
            createBy: bookData.created_by?._id,
            updateBy: bookData.updated_by?._id,
            book_condition: bookData.book.condition, // Use condition from bookData
            fine_reason: fineData.fine_reason,
            condition_detail: bookData.book.condition_detail, // Use condition_detail from bookData
        };

        if (checkIdentityCode === bookData.book.identifier_code) {
            axios.post(`https://fptu-library.xyz/api/orders/return/${bookData._id}`, payload)
                .then((response) => {
                    if (response.status === 200) {
                        toast.success("Đã trả sách thành công!");
                        handleCloseModal();
                        handleSearchByStudentID(studentCode);
                    }
                }).catch((error) => {
                    const message = error.response?.data?.message;
                    toast.error(message);
                });
        } else {
            toast.error("The identification code is incorrect. Please try again.");
        }
    }

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = bookList.slice(offset, offset + itemsPerPage);

    return (
        <div className="return-book-container container">
            <ToastContainer />
            <div className="row mb-3">
                <div className="d-flex justify-content-start search-by-student-id col-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập mã sinh viên, hoặc mã cán bộ, giảng viên"
                        value={studentCode}
                        style={{ width: "50%", marginRight: "10px" }}
                        onChange={(e) => setStudentCode(e.target.value)}
                    />
                    <button className="btn btn-primary" title="Tìm kiếm" onClick={handleSearchByStudentID}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="d-flex justify-content-start search-by-identity-code col-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập mã định danh sách"
                        value={identityCode}
                        style={{ width: "50%", marginRight: "10px" }}
                        onChange={(e) => setIdentityCode(e.target.value)}
                    />
                    <button className="btn btn-primary" title="Tìm kiếm" onClick={handleSearchByIdentityCode}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div className="table-list-book">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Tên sách</th>
                            <th>Ngày mượn</th>
                            <th>Ngày hẹn trả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((book) => (
                                <tr key={book._id}>
                                    <td>{book.book_id?.bookSet_id?.title}</td>
                                    <td>
                                        <input type="date" className="form-control text-center" value={book.borrowDate?.split('T')[0] || ''} readOnly />
                                    </td>
                                    <td>
                                        <input type="date" className="form-control text-center" value={book.dueDate?.split('T')[0] || ''} readOnly />
                                    </td>
                                    <td>{book.status === "Pending" ? "Đang chờ" :
                                        book.status === "Received" ? "Đã nhận" :
                                            book.status === "Canceled" ? "Đã hủy" :
                                                book.status === "Lost" ? "Đã mất" :
                                                    book.status === "Returned" ? "Đã trả" :
                                                        book.status === "Renew Pending" ? "Đang gia hạn" :
                                                            book.status === "Approved" ? "Đã xác nhận" : "Không xác định"}</td>
                                    {book.status === "Received" && (
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleReturnBook(book._id)}>Trả sách</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Nhập mã sinh viên, hoặc mã định danh sách để tìm kiếm</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {bookList.length > 10 && (
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        pageCount={Math.ceil(bookList.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={10}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination justify-content-end'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active'}
                    />
                )}
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Return Book Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Tên sách</label>
                            <input type="text" className="form-control" value={bookData.book?.bookSet_id?.title || ''} disabled />
                        </div>
                        <div className="form-group">
                            <label>Ngày mượn</label>
                            <input type="date" className="form-control" value={bookData.borrowDate?.split('T')[0] || ''} disabled />
                        </div>
                        <div className="form-group">
                            <label>Ngày hẹn trả</label>
                            <input type="date" className="form-control" value={bookData.dueDate?.split('T')[0] || ''} disabled />
                        </div>
                        <div className="form-group">
                            <label>Ngày trả</label>
                            <input type="date" className="form-control" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái sách</label>
                            <select className="form-control" value={bookData.book?.condition || ''} onChange={(e) => setBookData({ ...bookData, book: { ...bookData.book, condition: e.target.value } })}>
                                <option value="Good">Tốt</option>
                                <option value="Light">Hư hỏng không đáng kể</option>
                                <option value="Medium">Hư hỏng nhẹ</option>
                                <option value="Hard">Hư hỏng nặng</option>
                                <option value="Lost">Mất</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tình trạng sách</label>
                            <input type="text" className="form-control" value={bookData.book?.condition_detail} onChange={(e) => setBookData({ ...bookData, book: { ...bookData.book, condition_detail: e.target.value } })} />
                        </div>
                        <div className="form-group">
                            <label>Mã định danh sách</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={flag ? checkIdentityCode : ""} 
                                onChange={(e) => setCheckIdentityCode(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Lý do phạt</label>
                            <input type="text" className="form-control" value={fineData.fine_reason} onChange={(e) => setFineData({ fine_reason: e.target.value })} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>
                        Gửi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ReturnBook;
