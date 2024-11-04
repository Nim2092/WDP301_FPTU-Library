import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Container, Pagination } from "react-bootstrap";
import AuthContext from "../../contexts/UserContext";

function Notification() {
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  useEffect(() => {
    axios
      .get(`https://fptu-library.xyz/api/notifications/get/${user.id}`)
      .then((response) => {
        const sortedNotifications = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotification(sortedNotifications);
        console.log(response.data);

        axios
          .put(`https://fptu-library.xyz/api/notifications/markAsRead/${user.id}`)
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
        return "#e0f7fa"; // Đổi sang màu xanh nhạt
      case "Returned":
        return "#c8e6c9"; // Đổi sang màu xanh lá nhạt
      case "Pending":
        return "#fff9c4"; // Đổi sang màu vàng nhạt
      case "Approved":
        return "#ffecb3"; // Đổi sang màu cam nhạt
      case "Overdue":
        return "#ffcdd2"; // Đổi sang màu đỏ nhạt
      case "Canceled":
        return "#ef9a9a"; // Đổi sang màu đỏ mềm
      case "Reminder":
        return "#dcedc8"; // Đổi sang màu xanh lá nhạt hơn
      case "Rejected":
      case "Fines":
      case "Lost":
        return "#ef9a9a"; // Đổi sang màu đỏ nhạt cho các loại này
      case "Renew":
      case "Borrow":
        return "#e0f7fa"; // Đổi sang màu xanh nhạt cho các loại này
      default:
        return "#ffffff"; // Mặc định là màu trắng
    }
  };

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notification.slice(indexOfFirstNotification, indexOfLastNotification);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-5">
      {currentNotifications.length > 0 ? (
        currentNotifications.map((notif) => (
          <Card
            key={notif._id}
            className="mb-3"
            style={{
              backgroundColor: getBackgroundColor(notif.type),
            }}
          >
            <Card.Header>{notif.type}</Card.Header>
            <Card.Body>
              <Card.Text>{notif.message}</Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No notifications available.</p>
      )}

      {/* Pagination */}
      <Pagination className="mt-4">
        {[...Array(Math.ceil(notification.length / notificationsPerPage)).keys()].map((num) => (
          <Pagination.Item
            key={num + 1}
            active={num + 1 === currentPage}
            onClick={() => paginate(num + 1)}
          >
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
}

export default Notification;
