import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Container } from "react-bootstrap";

function Notification() {
  const [notification, setNotification] = useState([]); // Initialize as an empty array

  useEffect(() => {
    axios
      .get(`http://localhost:9999/api/notifications/get/670bdc4222dbb6713f265b82`)
      .then((response) => {
        setNotification(response.data.data); // Set only the data array to state
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notification:", error);
      });
  }, []);

  return (
    <Container className="mt-5">
      {notification.length > 0 ? (
        notification.map((notif) => (
          <Card
            key={notif._id}
            className="mb-3"
            style={{
              backgroundColor: notif.isRead ? "#f8f9fa" : "#d4edda", 
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
