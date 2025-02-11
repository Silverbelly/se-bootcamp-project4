import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Comments from '../Comments/Comments';
import './PostList.css';

function PostList({currentTopic, currentUser}) {
  const [serverUrl] = useState('http://localhost:3000');
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

  const renderContent = () => {
    if (posts.length === 0) {
      return (
        <div>
          <h3>No posts found for this topic</h3>
        </div>
      )
    } else {
      return (
        <div>
          {
            posts.map((post) => (
              <div key={post.id}>
                <h4>{post.content}</h4>
                <div className="comments-container">
                  <Comments currentPost={post.id} currentUser={currentUser} />
                </div>
              </div>
            ))
          }
        </div>
      )
    }
  }

  return (
    <div>
      <div>
        <p className="topic-breadcrumb">Topic : {currentTopic.topic}</p>
        {
          renderContent()
        }
      </div>
    </div>
  )
}

export default PostList;