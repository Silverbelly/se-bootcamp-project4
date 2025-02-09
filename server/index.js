import express from 'express';
import cors from 'cors';
import users from './routes/users.js';
import posts from './routes/posts.js';
import topics from './routes/topics.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', users);
app.use('/posts', posts);
app.use('/topics', topics);

app.get('/port', (req, res) => {
  res.json({ port: PORT});
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

