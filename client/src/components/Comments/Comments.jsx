import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comments.css';

function Comments({currentPost, currentUser}) {
  const [serverUrl] = useState('http://localhost:3000');
  const [comments, setComments] = useState([]);
  const [userDetails] = useState(currentUser);

  useEffect(() => {
    getComments(currentPost);
  }, [currentPost]);  

  const getComments = async (postId) => {
    try { await
      axios.get(`${serverUrl}/posts/${currentPost}/comments`).then((response) => {
        setComments(response.data.data);
      });
    } catch (error) {
      if (error.response.status === 404) {
        setComments([]);
      }
      else {
        console.log(error);
      }
    }
  };

  const renderContent = () => {
    if (comments.length === 0) {
      return (
        <div className="comment">
          <h5>No responses to this post.</h5>
          <button className="comment-button" onClick={addReply}>Add a comment</button>
        </div>
      )
    } else {
      return (
        <div>
          {
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <h5>By {comment.firstName} {comment.lastName} on {comment.dateCommented}</h5>
                <p>{comment.content}</p>
              </div>
            ))
          }
          <button className="comment-button" onClick={addReply}>Add a comment</button>
        </div>
      )
    }
  }

  const addReply = () => {
    const reply = prompt('Enter your reply:');
    if (reply) {
      axios.post(`${serverUrl}/posts/${currentPost}/comments`, {
        postId: currentPost,
        userId: userDetails.id,
        content: reply,
      }).then(() => {
        getComments(currentPost);
      });
    }
  }
  return (
    <div>
      {
        renderContent()
      }
    </div>
  )
}

export default Comments;