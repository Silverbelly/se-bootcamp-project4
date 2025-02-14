import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

const connection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ga_forum',
});

// GET all posts
router.get('/', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Invalid request, please provide a topic id',
  });
});

// GET all comments, invalid request
router.get('/comments/', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Invalid request, please provide a post id',
  });
});

// GET all comments by post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const data = await connection
      .promise()
      .query('SELECT c.id, c.postId, c.userId, c.content, c.dateCommented, u.firstName, u.lastName, u.userName'
        + ' FROM comments c'
        + ' INNER JOIN users u on c.userId = u.id'
        + ' WHERE postId = ?'
        + ' ORDER BY dateCommented desc', [postId]);
    if (data[0].length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'No comments found for post ' + postId,
      });
    }
    else {
      res.status(200).json({
        status: 'success',
        data: data[0],
      });
    }
  }
  catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// POST create a new post
router.post('/', async (req, res) => {
  try {
    const { topicId, userId, content } = req.body;
    const result = await connection
      .promise()
      .query('INSERT INTO posts (topicId, userId, content)'
          + ' VALUES (?, ?, ?)', [topicId, userId, content], (error, results) => {
          return results;
        }
      );
      res.status(201).json({
        status: 'created',
        data: {
          id: result[0].insertId,
        }
      });
  }
  catch (error) {
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        res.status(409).json({
          status: 'error',
          message: 'A post with that name already exists for for the specified topic',
        });
        break;
      default:
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
    }
  }
});

// POST create a new comment
router.post('/:postId/comments', async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    const result = await connection
      .promise()
      .query('INSERT INTO comments (postId, userId, content)'
          + ' VALUES (?, ?, ?)', [postId, userId, content], (error, results) => {
          return results;
        }
      );
      res.status(201).json({
        status: 'created',
        data: {
          id: result[0].insertId,
        }
      });
  }
  catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// GET default, not found
router.get('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Nothing to see here. Move along.',
  });
});

export default router;