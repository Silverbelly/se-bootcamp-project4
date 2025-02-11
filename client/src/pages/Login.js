import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ setUser }) {
  const [serverUrl] = useState('http://localhost:3000');
  const [errorMessage, setErrorMessage] = useState('');
  const [userValidated, setUserValidated] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const userNameRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (userValidated) {
      setUser(userDetails);
      navigate('/dashboard');
    }
  }, [userValidated]);

  const validateUser = async (e) => {
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
            setErrorMessage('Invalid username or password');
          }
        });
    } catch (error) {
      switch (error.response.status) {
        case 400:
          setErrorMessage('Invalid request. Please provide a username and password');
          break;
        case 401:
          setErrorMessage('Invalid username or password');
          break;
        default:
          setErrorMessage('An error occurred. Contact the site administrator.');
          break;
      }
    }
  };

  const showRegister = (e) => {
    e.preventDefault(); 
    navigate('/register');
  };

  return (
    <div>
      <form onSubmit={validateUser} id="login-form" className="login-container">
        <input type="text" id="username" placeholder="Username" ref={userNameRef} />
        <input type="password" id="password" placeholder="Password" ref={passwordRef} />
        <button type="submit" id="submit">
          Login
        </button>
        <div>
          Not a member? <a href="/" onClick={showRegister}>Register Now</a>
        </div>
        <div id="error">{errorMessage}</div>
      </form>
    </div>
  );
}

export default Login;
