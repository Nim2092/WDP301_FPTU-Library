import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Container } from "react-bootstrap";
import AuthContext from "../../contexts/UserContext";

function Notification() {
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/api/notifications/get/${user.id}`)
      .then((response) => {
        setNotification(response.data.data); // Set only the data array to state
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notification:", error);
      });
  }, [user.id]);

  // Function to determine background color based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case "Borrow":
        return "#f0f8ff"; // light blue
      case "Return":
        return "#d1e7dd"; // light green
      case "Renewal":
        return "#fef3c7"; // light yellow
      case "Reminder":
        return "#fff3cd"; // light orange
      case "Overdue":
        return "#f8d7da"; // light red
      case "Fines":
        return "#f5c6cb"; // soft red
      case "Approval":
        return "#d4edda"; // light green
      case "Rejected":
        return "#f8d7da"; // light red for rejected
      default:
        return "#ffffff"; // white as default
    }
  };

  return (
    <Container className="mt-5">
      {notification.length > 0 ? (
        notification.map((notif) => (
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
        <p>Loading notifications...</p>
      )}
    </Container>
  );
}

export default Notification;
