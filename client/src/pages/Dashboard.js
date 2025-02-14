import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/TopicList/TopicList';
import '../styles/Dashboard.css';
import TopicList from '../components/TopicList/TopicList';
import PostList from '../components/PostList/PostList';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {Navbar, Nav} from 'react-bootstrap';

function Dashboard({user, setUser}) {

  const [currentUser] = useState(user);
  const [currentTopic, setCurrentTopic] = useState({ id: -1});
  const [isPosting, setIsPosting] = useState(false);

  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  }

  useEffect(() => {
    if (currentUser.id === -1) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleTopicChanged = (topic) => {
    setCurrentTopic(topic);
    setIsPosting(false);
  };

  const renderContent = () => {
    if (currentTopic.id === -1) {
      return (
        <div>
          <h3>Welcome to the GenAv Community Forum!</h3>
          <p>This is the main content area. You can post messages here.</p>
        </div>
      )
    } else {
      return (
        <PostList currentTopic={currentTopic} currentUser={currentUser} isPosting={isPosting} setIsPosting={setIsPosting} />
      )
    }
  }

  const signOut = () => {
    setUser({id: -1});
    navigate('/');
  };
  
  return (
    <div>
      <Container fluid>
        <Row className="align-items-center bg-dark text-white pt-2">
          <Navbar expand="md">
            <Col className="ms-2">Welcome, {currentUser.firstName}!</Col>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                <Col className="text-center">
                  <h4>GenAv Community Forum</h4>
                  <p>All about General Aviation</p>
                </Col>
              </Nav>
          </Navbar.Collapse>
          <Col className="me-2 text-end">
            <Button variant="primary" onClick={signOut}>Sign Out</Button>
          </Col>
        </Navbar>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          <Col md={3} lg={3} xl={2} className="bg-primary text-white min-vh-100">
            <TopicList handleTopicChanged={handleTopicChanged} />
          </Col>
          <Col>
            {
            renderContent()
            }
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard;