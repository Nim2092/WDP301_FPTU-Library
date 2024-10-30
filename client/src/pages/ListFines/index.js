import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function ListFines() {
    const [fines, setFines] = useState([]);
    const [userCode, setUserCode] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Số mục trên mỗi trang

    useEffect(() => {
        // Fetch toàn bộ dữ liệu phạt từ API
        axios.get("http://localhost:9999/api/fines/getAll")
            .then((response) => {
                setFines(response.data.data);
            })
            .catch((error) => {
                toast.error("Không thể tải dữ liệu phạt.");
                console.error("Lỗi khi lấy dữ liệu phạt:", error);
            });
    }, []);

    // Tìm kiếm theo mã người dùng
    const handleSearchByUserCode = () => {
        axios.get(`http://localhost:9999/api/fines/by-code/${userCode}`)
            .then((response) => {
                setFines(response.data.data);
            })
            .catch((error) => {
                toast.error("Không thể tải dữ liệu phạt.");
                console.error("Lỗi khi tìm kiếm dữ liệu phạt:", error);
            });
    };

    // Tìm kiếm theo trạng thái
    const handleSearchByStatus = (status) => {
        if (status === "") {
            // Nếu status rỗng, gọi API lấy tất cả dữ liệu
            axios.get("http://localhost:9999/api/fines/getAll")
                .then((response) => {
                    setFines(response.data.data);
                })
                .catch((error) => {
                    toast.error("Không thể tải dữ liệu phạt.");
                    console.error("Lỗi khi tìm kiếm dữ liệu phạt:", error);
                });
        } else {
            // Nếu có status, gọi API filter theo status
            axios.get(`http://localhost:9999/api/fines/filter-by-status/${status}`)
                .then((response) => {
                    setFines(response.data.data);
                })
                .catch((error) => {
                    toast.error("Không thể tải dữ liệu phạt.");
                    console.error("Lỗi khi tìm kiếm dữ liệu phạt:", error);
                });
        }
    };

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = fines.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(fines.length / itemsPerPage);

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <div className="row">
                <div className="col-md-9">
                    <h2 className="mb-4">Danh sách các khoản phạt</h2>
                </div>
                <div className="col-md-3">
                    <div className="mb-3">
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleSearchByStatus(e.target.value);
                            }}
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="Pending">Chưa thanh toán</option>
                            <option value="Paid">Đã thanh toán</option>
                            <option value="Overdue">Quá hạn</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo mã người dùng"
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleSearchByUserCode}
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>
            {/* Bảng hiển thị danh sách phạt */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tựa sách</th>
                        <th>Mã người dùng</th>
                        <th>Tình trạng sách</th>
                        <th>Tổng tiền phạt</th>
                        <th>Trạng thái</th>
                        <th>Lý do phạt</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        null
                    ) : (
                        currentItems.map((fine, index) => (
                            <tr key={fine._id}>
                                <td>{index + 1}</td>
                                <td>{fine.book_id?.bookSet_id?.title || "N/A"}</td>
                                <td>{fine.user_id?.code || "N/A"}</td>
                                <td>{fine.book_id?.condition || "N/A"}</td>
                                <td>{fine.totalFinesAmount || "N/A"} VNĐ</td>
                                <td>{fine.status}</td>
                                <td>{fine.reason || fine.fineReason_id?.reasonName || "N/A"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Thêm phân trang */}
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (
                        <li
                            key={index + 1}
                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default ListFines;
