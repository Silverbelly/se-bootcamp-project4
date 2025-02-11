import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './TopicList.css';

function TopicList({setCurrentTopic}) {
  const [serverUrl] = useState('http://localhost:3000');
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

  return (
    <ul>
      {
        topics.map((topic) => (
          <li key={topic.id} onClick={() => setCurrentTopic(topic)}>{topic.topic}</li>
        ))
      }
    </ul>
  )
}

export default TopicList