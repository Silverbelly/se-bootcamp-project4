import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Login({ setUser }) {
  const [serverUrl] = useState('http://localhost:5000');
  const [userValidated, setUserValidated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [error, setError] = useState({message: '', hidden: true});
  const [formValidated, setFormValidated] = useState(false);

  const userNameRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (userValidated) {
      setUser(userDetails);
      navigate('/dashboard');
    }
  }, [userValidated, setUser, navigate, userDetails]);

  const validateUser = async (e) => {
    const form = e.currentTarget;
    let formIsValid = form.checkValidity();
    if (formIsValid === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFormValidated(true);
    if (formIsValid === true) {
      e.preventDefault();
      try {
        await axios
          .post(serverUrl + '/users/login', {
            userName: userNameRef.current.value,
            password: passwordRef.current.value,
          })
          .then((response) => {
            if (response.status === 200) {
              setUserValidated(true);
              setUserDetails(response.data.data);
            } else {
              setError({message: 'Invalid Username or Password.', hidden: false});
            }
          });
      } catch (error) {
        switch (error.response.status) {
          case 400:
            setError({message: 'Please provide your Username an Password.', hidden: false});
            break;
          case 401:
            setError({message: 'Invalid Username or Password.', hidden: false});
            break;
          default:
            setError({message: 'Uh-oh! Something went wrong. Contact the site administrator.', hidden: false});
            break;
        }
      }
    }
  };

  const showRegister = (e) => {
    e.preventDefault(); 
    navigate('/register');
  };

  return (
    <div>
      <Container fluid className="mt-5">
        <Row className="justify-content-center">
          <Col xs={11} sm={8} md={5} lg={4} xl={3} className="bg-dark rounded-4">
            <Form noValidate validated={formValidated} className="p-3" onSubmit={validateUser}>
              <Form.Group>
                <Form.Label className="text-white">User Name</Form.Label>
                <Form.Control type="text" placeholder="username" ref={userNameRef} required />
                <Form.Control.Feedback type="invalid">Enter your Username</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-white mt-3">Password</Form.Label>
                <Form.Control type="password" placeholder="password" ref={passwordRef} required />
                <Form.Control.Feedback type="invalid">Please enter your password</Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" className="mt-4 mb-2 p-2" type="submit">
                Sign In
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="mt-3 justify-content-center">
          <Col xs={11} sm={8} md={5} lg={4} xl={3} className="rounded-4 text-center">
            Already a member? <a href="/" onClick={showRegister} rel="noopener noreferrer">Register Now</a>
          </Col>
        </Row>
        <Row className="mt-3 justify-content-center">
          <Col xs={11} sm={8} md={5} lg={4} xl={3} className="rounded-4">
            <Alert hidden={error.hidden} variant="danger">
              {error.message}
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
