import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Register({setUser}) {
  
  const [serverUrl] = useState('http://localhost:5000');
  const [userIsRegistered, setUserIsRegistered] = useState(false);  
  const [userDetails, setUserDetails] = useState({});
  const [formValidated, setFormValidated] = useState(false);
  const [error, setError] = useState({message: '', hidden: true});
  
  const navigate = useNavigate();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const userNameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    if (userIsRegistered) {
      setUser(userDetails);
      navigate('/dashboard');
    }
  }, [userIsRegistered, navigate, setUser, userDetails]);
  
  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      e.preventDefault();
      setError({message: 'Password and Confirm Password do not match.', hidden: false});
      return;
    }
    let formIsValid = form.checkValidity();
    if (formIsValid === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFormValidated(true);
    if (formIsValid) {
      e.preventDefault();
      try {
        await axios
          .post(serverUrl + '/users/register', {
            firstName: firstNameRef.current.value, 
            lastName: lastNameRef.current.value, 
            email: emailRef.current.value,
            userName: userNameRef.current.value,
            password: passwordRef.current.value,
          })
          .then((response) => {
            if (response.status === 201) {
              setUserDetails(response.data.data);
              setUserIsRegistered(true);
            }
          });
      } catch (error) {
        setError({ message: error.response.data.message, hidden: false })
      }
    }
  };

  return (
    <div>
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={5} lg={4} xl={3} className="bg-dark rounded-3">
            <Form noValidate validated={formValidated} className="p-3" onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label className="text-white">First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" ref={firstNameRef} required />
                    <Form.Control.Feedback type="invalid">Enter your First Name</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className="text-white">Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" ref={lastNameRef} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label className="text-white mt-3">Email</Form.Label>
                <Form.Control type="email" placeholder="Email address" ref={emailRef} required />
                <Form.Control.Feedback type="invalid">Provide a valid email address</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-white mt-3">User Name</Form.Label>
                <Form.Control type="text" placeholder="Choose a user name" ref={userNameRef} required />
                <Form.Control.Feedback type="invalid">Must choose a Username</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-white mt-3">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
                <Form.Control.Feedback type="invalid">Please enter your password</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-white mt-3">Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" ref={confirmPasswordRef} required />
                <Form.Control.Feedback type="invalid">Please confirm your password</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" className="mt-4 mb-2 p-2" type="submit">
                Sign Up
              </Button>
            </Form>
            <Alert hidden={error.hidden} variant="danger">
              {error.message}
            </Alert>
          </Col>
        </Row>
      </Container>  
    </div>
  )
}

export default Register;