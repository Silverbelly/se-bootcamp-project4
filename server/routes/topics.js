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

// GET all topics
try {
  router.get('/', async (req, res) => {
    const data = await connection
      .promise()
      .query('SELECT * FROM topics order by sortOrder');
      if (data[0].length === 0) {
        res.status(404).json({
          status: 'error',
          message: 'No topics found',
        });
      }
      else {
        res.status(200).json({
          status: 'success',
          data: data[0],
        });
      }
    });
}
catch (error) {
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}

// GET all posts by topic
router.get('/:topicId/posts', async (req, res) => {
  try {
    const { topicId } = req.params;
    const data = await connection
      .promise()
      .query('SELECT p.id, p.title, p.content, p.datePosted, u.id, u.firstName, u.lastName'
          + ' FROM posts p'
          + ' INNER JOIN users u on p.userId = u.id'
          + ' WHERE topicId = ?'
          + ' ORDER BY datePosted desc', [topicId]);
    if (data[0].length === 0) {
      res.status(404).json({
        status: 'error',
        message: 'No posts found for topic ' + topicId,
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

// GET not found
router.get('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Nothing to see here. Move along.',
  });
});

export default router;