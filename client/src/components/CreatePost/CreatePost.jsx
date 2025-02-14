import React, { useState, useRef } from 'react'
import axios from 'axios';
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import './CreatePost.css';

function CreatePost({ currentTopic, getPosts, currentUser, toggleCreatePost }) {

  const [serverUrl] = useState('http://localhost:5000');
  const [userDetails] = useState(currentUser);
  const [topic] = useState(currentTopic);
  const [charsRemaining, setCharsRemaining] = useState(250);
  const [maxPostLength] = useState(250);
  
  const postContentRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = {
        topicId: currentTopic.id,
        userId: userDetails.id,
        title: '',
        content: postContentRef.current.value
      };
      await axios
        .post(`${serverUrl}/posts`, newPost)
        .then((response) => {
          if (response.status === 201) {
            postContentRef.current.value = '';
            toggleCreatePost(false);
            getPosts(currentTopic.id);
          }
          else {
            alert(`Error: ${response.status}. Post not created.`)
          }
      });
    }
    catch (error) {
      console.log('Post creation failed.', error);
    }
  }

  const handleCancel = () => {
    postContentRef.current.value = '';
    setCharsRemaining(maxPostLength)
    toggleCreatePost(false);
  }

  const updateCharsRemaining = (e) => {
    const remainingChars = maxPostLength - e.target.value.length;
    setCharsRemaining(remainingChars);
  }
  
  return (
    <>
      <Container fluid>
        <Row className="bg-dark rounded-2 m-4 py-2">
        <Form>
          <Row className="me-2">
            <Form.Group>
              <Form.Label className="text-white">What do you want to talk about?</Form.Label>
              <Form.Control required as="textarea" maxLength={maxPostLength} rows={2} onChange={updateCharsRemaining} ref={postContentRef} placeholder="Post a question..." />
            </Form.Group>
          </Row>
          <Row className="mt-1 mb-1 me-2">
            <Col>
              <Button variant="primary buttons py-1" type="submit" onClick={handleSubmit}>Save</Button>
              <Button variant="primary buttons py-1" className="ms-3" onClick={handleCancel}>Cancel</Button>
            </Col>
            <Col className="text-end text-white chars-remaining">
              {charsRemaining}/{maxPostLength}
            </Col>
          </Row>
        </Form>
        </Row>
      </Container>
    </>
  )
}

export default CreatePost