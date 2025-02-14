import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Container, Row, Col} from 'react-bootstrap';
import './Comments.css';

function Comments({currentPost, currentUser}) {
  const [serverUrl] = useState('http://localhost:5000');
  const [comments, setComments] = useState([]);
  const [userDetails] = useState(currentUser);
  const [commentEntry, setCommentEntry] = useState(false);
  const [maxCommentLength] = useState(1000);
  const [charsRemaining, setCharsRemaining] = useState(1000);

  const commentRef = useRef();

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

  const handleCommentChange = (e) => {
    const remainingChars = maxCommentLength - e.target.value.length;
    setCharsRemaining(remainingChars);
  }

  const toggleCommentEntry = () => {
    setCommentEntry(!commentEntry);
  };

  const cancelReply = () => {
    commentRef.current.value = '';
    setCharsRemaining(maxCommentLength);
    toggleCommentEntry();
  };

  const addReply = async () => {
    const reply = commentRef.current.value;
    if (reply) {
      await axios.post(`${serverUrl}/posts/${currentPost}/comments`, {
        postId: currentPost,
        userId: userDetails.id,
        content: reply,
      }).then((response) => {
        if (response.status === 201) {
          commentRef.current.value = '';
          toggleCommentEntry();
          getComments(currentPost);
        }
        else {
          alert(`Error: ${response.status}. Comment not created.`)
        }
      });
    }
  };

  const renderContent = () => {
    return (
        <>
          {
            comments.length === 0 ? (
                <p className="mt-2">No comments to this post.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id}>
                  <p className="mb-1">{comment.content}</p>
                  <p className="comment text-primary">
                    @{comment.userName} commented on {new Date(comment.dateCommented).toLocaleDateString('en-US')} at {new Date(comment.dateCommented).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                  </p>
                </div>
              ))
            )
          }
          <Button className="comment-button mb-2 p-1" hidden={commentEntry} onClick={toggleCommentEntry}>Add a comment</Button>
          <Container fluid hidden={!commentEntry}>
            <Form.Control as="textarea" maxLength={1000} rows={2} placeholder='Your reply...' ref={commentRef} onChange={handleCommentChange} />
            <Row className="mt-1 mb-1">
              <Col>
                <Button variant="primary" className="comment-button py-1" type="submit" onClick={addReply}>Save</Button>
                <Button variant="primary" className="comment-button py-1 ms-3" onClick={cancelReply}>Cancel</Button>
              </Col>
              <Col className="text-end chars-remaining">
                {charsRemaining}/{maxCommentLength}
              </Col>
            </Row>
          </Container>
        </>
    )
  };

  return (
    <>
      {
        renderContent()
      }
    </>
  )
}

export default Comments;