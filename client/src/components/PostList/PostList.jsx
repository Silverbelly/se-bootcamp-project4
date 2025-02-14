import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Comments from '../Comments/Comments';
import CreatePost from '../CreatePost/CreatePost';
import './PostList.css';

function PostList({currentTopic, currentUser, isPosting, setIsPosting}) {
  const [serverUrl] = useState('http://localhost:5000');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts(currentTopic.id);
  }, [currentTopic]);  

  const getPosts = async () => {
    try { await
      axios.get(`${serverUrl}/topics/${currentTopic.id}/posts`).then((response) => {
        setPosts(response.data.data);
      });
    } catch (error) {
      if (error.response.status === 404) {
        setPosts([]);
      }
      else {
        console.log(error);
      }
    }
  };

  const toggleCreatePost = (tf) => {
    setIsPosting(tf);
  }

  const renderContent = () => {
      return (
        <div>
            {
              posts.length === 0 ? (
                <Container fluid className="mt-2">
                  <h5>No posts to this topic yet.</h5>
                </Container>
              ) : (
              posts.map((post) => (
                <Container fluid key={post.id} className="m-2">
                  <Row className="mb-2">
                    <h5>{post.content}</h5>
                  </Row>
                  <Row className="bg-light border border-dark-subtle rounded-3 ms-2 me-4">
                    <Col sm={12}>
                      <Comments currentPost={post.id} currentUser={currentUser} />
                    </Col>
                  </Row>
                </Container>
              ))
            )
          }
        </div>
      )
  }

  return (
    <div>
      <Container fluid className="m-4">
        <Row>
          <Col className="p-0">
            <p className="topic-breadcrumb text-primary">Topic : {currentTopic.topic}</p>
          </Col>
          <Col className="text-end me-4">
            <Button variant="primary ask-question-button" onClick={() => toggleCreatePost(true)}>Ask a Question</Button>
          </Col>
        </Row>
      </Container>
      <Row hidden={!isPosting}>
          <CreatePost currentTopic={currentTopic} getPosts={getPosts} currentUser={currentUser} toggleCreatePost={toggleCreatePost} />
      </Row>
        {
          renderContent()
        }
      </div>
  )
}

export default PostList;