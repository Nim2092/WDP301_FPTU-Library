import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import './UserProfile.scss'; 

const UserProfile = () => {
  const { id } = useParams();
  
  const [profile, setProfile] = useState({
    code: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://fptu-library.xyz/api/user/profile/${id}`) 
      .then(response => {
        const userData = response.data.data; 
        setProfile({
          code: userData.code,
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          image: userData.image ? `http://localhost:9999${userData.image}` : '', 
        });
        setLoading(false); 
      })
      .catch(error => {
        console.error("There was an error fetching the profile!", error);
        setLoading(false); 
      });
  }, [id]); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Container className="profile-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center profile-card">
            <Card.Body>
              <Image 
                src={profile.image || 'https://via.placeholder.com/150'} // Fallback to placeholder if no image
                roundedCircle 
                className="profile-image"
              />
              <Card.Title className="profile-name">{profile.fullName}</Card.Title>
              <Card.Text className="profile-details">
                <strong>Code:</strong> {profile.code} <br />
                <strong>Email:</strong> {profile.email} <br />
                <strong>Phone:</strong> 0{profile.phoneNumber} <br />
              </Card.Text>
              <Button className="profile-button" onClick={() => alert('Edit Profile')}>
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
