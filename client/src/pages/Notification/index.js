import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Container, Pagination } from "react-bootstrap";
import AuthContext from "../../contexts/UserContext";
import ReactPaginate from "react-paginate";
function Notification() {
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  useEffect(() => {
    axios
      .get(`https://fptu-library/api/notifications/get/${user.id}`)
      .then((response) => {
        const sortedNotifications = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotification(sortedNotifications);
        console.log(response.data);

        axios
          .put(`https://fptu-library/api/notifications/markAsRead/${user.id}`)
          .then(() => {
            console.log("All notifications marked as read");
          })
          .catch((error) => {
            console.error("Error marking notifications as read:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching notification:", error);
      });
  }, [user.id]);

  const getBackgroundColor = (type) => {
    switch (type) {
      case "Received":
        return { color: "#e0f7fa", label: "Đã nhận" }; // Đổi sang màu xanh nhạt
      case "Returned":
        return { color: "#c8e6c9", label: "Đã trả" }; // Đổi sang màu xanh lá nhạt
      case "Pending":
        return { color: "#fff9c4", label: "Đang chờ" }; // Đổi sang màu vàng nhạt
      case "Approved":
        return { color: "#ffecb3", label: "Đã duyệt" }; // Đổi sang màu cam nhạt
      case "Overdue":
        return { color: "#ffcdd2", label: "Quá hạn" }; // Đổi sang màu đỏ nhạt
      case "Canceled":
        return { color: "#ef9a9a", label: "Đã hủy" }; // Đổi sang màu đỏ mềm
      case "Reminder":
        return { color: "#dcedc8", label: "Nhắc nhở" }; // Đổi sang màu xanh lá nhạt hơn
      case "Rejected":
        return { color: "#ef9a9a", label: "Bị từ chối" }; // Đổi sang màu đỏ nhạt
      case "Fines":
        return { color: "#ef9a9a", label: "Phạt" }; // Đổi sang màu đỏ nhạt
      case "Lost":
        return { color: "#ef9a9a", label: "Mất" }; // Đổi sang màu đỏ nhạt
      case "Renew":
        return { color: "#e0f7fa", label: "Gia hạn" }; // Đổi sang màu xanh nhạt
      case "Borrow":
        return { color: "#e0f7fa", label: "Mượn" }; // Đổi sang màu xanh nhạt
      default:
        return { color: "#ffffff", label: "Không xác định" }; // Mặc định là màu trắng
    }
  };

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notification.slice(indexOfFirstNotification, indexOfLastNotification);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <Container className="mt-5">
      {currentNotifications.length > 0 ? (
        currentNotifications.map((notif) => {
          const { color, label } = getBackgroundColor(notif.type);
          return (
            <Card
              key={notif._id}
              className="mb-3"
              style={{
                backgroundColor: color,
              }}
            >
              <Card.Header>{label}</Card.Header>
              <Card.Body>
                <Card.Text>{notif.message}</Card.Text>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <p>Không có thông báo nào.</p>
      )}

      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        pageCount={Math.ceil(notification.length / notificationsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-end"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </Container>  
  );
}

export default Notification;
