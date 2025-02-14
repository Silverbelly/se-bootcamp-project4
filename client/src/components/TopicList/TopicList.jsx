import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './TopicList.css';
import Row from 'react-bootstrap/Row';

function TopicList({handleTopicChanged}) {
  const [serverUrl] = useState('http://localhost:5000');
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    try {
      axios.get(serverUrl + '/topics').then((response) => {
        setTopics(response.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);  

  const changeTopic = (id) => {
    let idx = topics.findIndex(t => t.id === id);
    let selTopic = topics[idx];
    handleTopicChanged(selTopic);
  };

  return (
    <>
      {
        topics.map((topic) => (
          <Row key={topic.id} 
               className="topic ps-3 py-3 border border-dark border-1 border-top-0 border-end-0 border-start-0" 
               onClick={() => changeTopic(topic.id)}>
            {topic.topic}
          </Row>
        ))
      }
    </>
  )
}

export default TopicList;