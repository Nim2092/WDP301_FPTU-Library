import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Button, Form } from 'react-bootstrap';
import './UserProfile.scss';
import { useNavigate } from 'react-router-dom';

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
          image: userData.image ? `https://fptu-library.xyz${userData.image}` : '',
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
      <Card className="p-4 shadow-sm">
        <Row>
          <Col md={4} className="text-center">
            <Image
              src={profile.image || 'https://via.placeholder.com/150'}
              roundedCircle
              className="profile-image mb-3"
              style={{ width: '150px', height: '150px' }}
            />
          </Col>
          <Col md={8}>
            <h4 className="mb-3">{profile.fullName}</h4>
            <Form>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}><strong>Code:</strong></Form.Label>
                <Col sm={9}>
                  <Form.Control readOnly defaultValue={profile.code} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}><strong>Email:</strong></Form.Label>
                <Col sm={9}>
                  <Form.Control readOnly defaultValue={profile.email} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}><strong>Phone:</strong></Form.Label>
                <Col sm={9}>
                  <Form.Control readOnly defaultValue={profile.phoneNumber} />
                </Col>
              </Form.Group>
            </Form>
            <Button variant="primary" className="mt-3" onClick={() => alert('Edit Profile')}>
              Edit Profile
            </Button>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default UserProfile;
