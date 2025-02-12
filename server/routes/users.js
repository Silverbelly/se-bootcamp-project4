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

// GET authenticate user
router.post('/login', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid request. Please provide a username and password',
      });
      return;
    }
    const { userName, password } = req.body;
    const data = await connection
      .promise()
      .query('SELECT * FROM users WHERE isActive = 1 AND userName = ? AND userPassword = MD5(?)', [userName, password]);
    if (data[0].length === 0) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid username or password',
      });
    } else {
      const user = data[0][0];
      res.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName, 
          accessLevel: user.accessLevel,
        }
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

// POST register user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password } = req.body;
    const result = await connection
      .promise()
      .query('INSERT INTO users (firstName, lastName, email, userName, userPassword) VALUES (?, ?, ?, ?, MD5(?))', 
        [firstName, lastName, email, userName, password], (err, result) => {
          return result;
        }
      );
      res.status(201).json({
        status: 'created',
        data: {
          id: result[0].insertId,
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          accessLevel: 'U',
        }
      });
  }
  catch (error) {
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        res.status(409).json({
          status: 'error',
          message: 'Username already exists. Please choose a different Username.',
        });
        break;
      default:
        console.log(error);
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
    }
  }
});

router.get('*', (req, res) => {
  res.status(404).json({
    status: 'Not found',
    message: 'Nothing to see here. Move along.',
  });
});

export default router;