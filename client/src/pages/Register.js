import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register({setUser}) {
  
  const [serverUrl] = useState('http://localhost:3000');
  const [errorMessage, setErrorMessage] = useState('');
  const [userIsRegistered, setUserIsRegistered] = useState(false);  
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const userNameRef = useRef();
  const passwordRef = useRef();
  
  useEffect(() => {
    if (userIsRegistered) {
      setUser(userDetails);
      navigate('/dashboard');
    }
  }, [userIsRegistered, navigate, setUser, userDetails]);
  
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(serverUrl + '/users/register', {
          firstName: firstNameRef.current.value, 
          lastName: lastNameRef.current.value, 
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
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={registerUser} id="register-form" class="register-container">
        <input type="text" id="firstname" placeholder="First Name" ref={firstNameRef} />
        <input type="text" id="lastname" placeholder="Last Name" ref={lastNameRef} />
        <input type="text" id="username" placeholder="Username" ref={userNameRef} />
        <input type="password" id="password" placeholder="Password" ref={passwordRef} />
        <button type="submit" id="submit">
          Register
        </button>
        <div id="error">{errorMessage}</div>
      </form>      
    </div>
  )
}

export default Register;