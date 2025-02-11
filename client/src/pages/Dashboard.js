import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/TopicList/TopicList';
import '../styles/Dashboard.css';
import TopicList from '../components/TopicList/TopicList';
import PostList from '../components/PostList/PostList';

function Dashboard({user, setUser}) {

  const [currentUser] = useState(user);
  const [currentTopic, setCurrentTopic] = useState({ id: -1});
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.id === -1) {
      navigate('/');
    }
  }, [currentUser, navigate]);

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
        <PostList currentTopic={currentTopic} currentUser={currentUser} />
      )
    }
  }

  const signOut = () => {
    console.log('sign out');
    setUser({id: -1});
    navigate('/');
  };
  
  return (
    <div>
      <div className="header-container">
        <div>
          Welcome, {currentUser.firstName}!
        </div>
        <div>
          <h2>GenAv Community Forum</h2>
        </div>
        <div>
          <button onClick={signOut}>Sign Out</button>
        </div>
      </div>
      <div className="left-nav-container">
        <TopicList setCurrentTopic={setCurrentTopic} />
      </div>
      <div className="main-container">
        {
          renderContent()
        }
      </div>
    </div>
  )
}

export default Dashboard;